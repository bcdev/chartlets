# Progress Implementation Note

Chartlets progress components are normal components, like all the others. 
`CircularProgress` and `LinearProgress` render when `hidden` is false and 
do not render when `hidden` is true.

The extra progress logic (`chartlets.js/packages/lib/src/actions/helpers/pendingProgress.ts`)
exists only to cover a timing problem: a backend callback can return 
component state changes only after it has finished. Without some frontend 
help, a Python callback computes for several seconds cannot show a spinner
during that same callback.

## How Pending Progress Works

A panel configures a progress component in its layout:

```python
CircularProgress(id="loading_progress", hidden=True)
```

If a callback's output includes the progress component's `hidden` property,
chartlets treats it as a pending-progress target:

```python
Output("loading_progress", "hidden")
```

When the callback is invoked, the frontend does the following before 
sending the backend request:

1. Find callback outputs that target `hidden` on a progress component.
2. Set those targets to `hidden: false` locally.
3. Send the backend callback request.

When the backend response arrives, normal callback outputs are applied. The
Python callback should return the final progress state, usually `True` for
`hidden` so the spinner disappears.

```python
return True, result
```

## Why The Output Is Required

The output declaration is the only signal that connects the callback to the
progress component. If a panel removes this output:

```python
# Output("loading_progress", "hidden")
```

then the frontend does not know that this callback should show that spinner.
The spinner remains in its layout state.

## Failure Handling

If the backend callback fails, no backend output will arrive to hide the
spinner. In that case, the frontend hides completed pending-progress targets by
setting `hidden: true`.

## Overlapping Callbacks

Multiple callbacks can target the same progress component. chartlets keeps a
small pending count per progress target so one finished callback does not hide a
spinner that is still needed by another pending callback.

## Alternative

The alternative would be to let every panel manage the state of long-running 
callback requests. This would keep the logic out of the frontend, but it would 
make each panel more complicated to set-up and maintain for the contributors.

