import { store } from "@/lib/store";
import { fetchLayout } from "@/lib/api/fetchLayout";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import { updateArray } from "@/lib/utils/updateArray";
import type { ContribPoint } from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib/types/state/contribution";

export function updateContributionContainer<S extends object = object>(
  contribPoint: ContribPoint,
  contribIndex: number,
  container: Partial<S>,
  requireComponent: boolean = true,
) {
  const { configuration, contributionsRecord } = store.getState();
  const contributionStates = contributionsRecord[contribPoint];
  const contributionState = contributionStates[contribIndex];
  if (contributionState.container === container) {
    return; // nothing to do
  }
  const isLayoutFetched = Boolean(contributionState.componentResult.status);
  if (!requireComponent || isLayoutFetched) {
    _updateContributionState(contribPoint, contribIndex, {
      container,
    });
  } else if (!isLayoutFetched) {
    // No status yet, so we must load the component
    _updateContributionState(contribPoint, contribIndex, {
      container,
      componentResult: { status: "pending" },
    });
    const inputValues = getLayoutInputValues(contribPoint, contribIndex);
    fetchLayout(
      contribPoint,
      contribIndex,
      inputValues,
      configuration.api,
    ).then((componentResult) => {
      _updateContributionState(contribPoint, contribIndex, {
        componentResult,
        component: componentResult.data,
      });
    });
  }
}

function getLayoutInputValues(
  contribPoint: ContribPoint,
  contribIndex: number,
): unknown[] {
  const { configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  const contributions = contributionsRecord[contribPoint];
  const contribution = contributions[contribIndex];
  const inputs = contribution.layout!.inputs;
  if (inputs && inputs.length > 0) {
    return getInputValues(inputs, contribution, hostStore?.getState());
  } else {
    return [];
  }
}

function _updateContributionState(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribState: Partial<ContributionState>,
) {
  const { contributionsRecord } = store.getState();
  const contribStates = contributionsRecord[contribPoint]!;
  const contribStateOld = contribStates[contribIndex];
  const contribStateNew = contribState.container
    ? {
        ...contribState,
        container: { ...contribStateOld.container, ...contribState.container },
      }
    : contribState;
  store.setState({
    contributionsRecord: {
      ...contributionsRecord,
      [contribPoint]: updateArray<ContributionState>(
        contribStates,
        contribIndex,
        contribStateNew,
      ),
    },
  });
}
