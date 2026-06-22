import { useCallback, useEffect, useState } from "react";

import { useAction } from "convex/react";

import { api } from "@convex/_generated/api";

export function useDevultur() {
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrlAction = useAction(api.devultur.createUploadUrl);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    issueViewerToken().then(setToken);
  }, [issueViewerToken]);

  const uploadUrl = useCallback(
    async (file: File) => {
      const r = await createUploadUrlAction({ filename: file.name, contentType: file.type });
      return { url: r.url, key: r.key };
    },
    [createUploadUrlAction],
  );

  return { token, uploadUrl };
}
