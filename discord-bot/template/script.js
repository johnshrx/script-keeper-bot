async function onRequest(context, request) {
  request.headers["X-API-KEY"] = "AQUI VA LA KEY"; //Aqui va la key del cliente
  return request;
}

async function onResponse(context, request, response) {
  const ASSET_ROUTE = "assetindexer";
  const SHADER_ROUTE = "x-shader";
  const base = "https://easy1.johneasy906.workers.dev/";
  const key = "AQUI VA LA KEY"; //Aqui va la key del cliente
  const url = request.url;
  try {
    if (
      url.includes("/CheckHackBehavior") ||
      url.includes("/GetMatchmakingBlacklist") ||
      url.includes("/GetReportAndPenalty")
    ) {
      response.statusCode = 403;
      response.body = "Blocked";
      delete response.headers["Content-Length"];
      return response;
    }
    if (url.includes("/1107/fileinfo") || url.includes("/fileinfo")) {
      const authCheck = await fetch(base + "fileinfo", {
        headers: { "X-API-KEY": key }
      });
      if (authCheck.status !== 200) {
        response.statusCode = 403;
        response.body = "Invalid key";
        delete response.headers["Content-Length"];
        return response;
      }
      let raw = response.body;
      if (url.includes("/1107/fileinfo")) {
        raw = raw.replace(
          "shaders,CbJecwXRBd13lZrA9R1x+1Pv124=,4179182,0,rdinKe5SxHHmJhdQAbV3lHZA4f8=,3472818,True,1",
          "shaders,BL31Qw1Q8W2gJoFPqILFVSENmeI=,4179182,0,QJ0GNV/annxbpRhALBoJ0kJT8fo=,3422023,True,1"
        );
      } else {
        raw = raw.replace(
          "avatar/assetindexer,PENojQAQf9a1l6Dzjs0n1Z3rtVU=,46640,0,t6Hrz7/gI5akAuvsgIoMGmt0bsU=,14162,True,0",
          "avatar/assetindexer,RKtd8UkhecNikyzkZaYk4wT+AHE=,46640,0,AHfokcFg+WE9IRu40r7RymowZ8A=,13747,True,0"
        );
      }
      response.body = raw;
      delete response.headers["Content-Length"];
      return response;
    }
    let route = "";
    if (url.includes("/1107/gameassetbundles/shaders")) {
      route = SHADER_ROUTE;
    } else if (url.includes("/assetindexer")) {
      route = ASSET_ROUTE;
    } else {
      return response;
    }
    const rawRes = await fetch(base + route, {
      headers: { "X-API-KEY": key }
    });
    if (rawRes.status !== 200) {
      response.statusCode = 403;
      response.body = "Invalid key";
      delete response.headers["Content-Length"];
      return response;
    }
    const raw = await rawRes.text();
    response.body = raw;
    response.statusCode = 200;
    response.headers["Content-Type"] = "application/octet-stream";
    delete response.headers["Content-Length"];
  } catch {
    response.statusCode = 500;
    response.body = "Error";
  }
  return response;
}
