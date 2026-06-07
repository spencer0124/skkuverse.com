interface Env {
  APPLE_TEAM_ID: string;
  IOS_BUNDLE_ID: string;
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${env.APPLE_TEAM_ID}.${env.IOS_BUNDLE_ID}`,
          paths: [
            "NOT /",
            "NOT /privacy",
            "NOT /terms",
            "/p/bus/*",
            "/p/campus",
            "/p/transit",
            "/p/map/*",
            "/p/search",
            "/p/notices/*",
            "/p/m/*",
          ],
        },
      ],
    },
  };

  return new Response(JSON.stringify(aasa), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
