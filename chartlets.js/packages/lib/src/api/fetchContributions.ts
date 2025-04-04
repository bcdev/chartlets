import { type Contributions } from "@/types/model/extension";
import { type Callback } from "@/types/model/callback";
import { normalizeObjPath } from "@/utils/objPath";
import { mapObject } from "@/utils/mapObject";
import type { Contribution } from "@/types/model/contribution";
import type { Channel } from "@/types/model/channel";
import type { ApiOptions, ApiResult } from "@/types/api";
import { makeUrl, callApi, fetchApiResult } from "./helpers";

export async function fetchContributions(
  options?: ApiOptions,
): Promise<ApiResult<Contributions>> {
  return fetchApiResult(_fetchContributions, options);
}

async function _fetchContributions(
  options?: ApiOptions,
): Promise<Contributions> {
  return callApi<Contributions>(
    makeUrl("contributions", options),
    undefined,
    normalizeContributions,
  );
}

function normalizeContributions(contributions: Contributions) {
  return {
    ...contributions,
    contributions: mapObject(
      contributions.contributions,
      (contributions: Contribution[]) =>
        contributions.map(
          (contribution): Contribution => ({
            ...contribution,
            layout: contribution.layout
              ? normalizeCallback(contribution.layout)
              : undefined,
            callbacks: normalizeCallbacks(contribution.callbacks),
          }),
        ),
    ),
  };
}

function normalizeCallbacks(callbacks: Callback[] | undefined): Callback[] {
  return callbacks ? callbacks.map(normalizeCallback) : [];
}

function normalizeCallback(callback: Callback): Callback {
  return {
    ...callback,
    inputs: callback.inputs ? normalizeChannels(callback.inputs) : [],
    outputs: callback.outputs ? normalizeChannels(callback.outputs) : [],
  };
}

function normalizeChannels<S extends Channel>(channels: S[]): S[] {
  return channels ? channels.map(normalizeChannel) : [];
}

function normalizeChannel<S extends Channel>(channel: S): S {
  return {
    ...channel,
    property: normalizeObjPath(channel.property),
  };
}
