package top.xcymm3.adv;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceResponse;

import androidx.webkit.WebViewAssetLoader;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

/** All HTTP requests terminate here, including misses; there is no network fallback. */
final class OfflineGameAssets {
    // Preserve the original online wrapper's localStorage origin during same-signature upgrades.
    static final String HOME_HOST = "adv.xcymm3.top";
    static final String HOME_URL = "https://" + HOME_HOST + "/";
    private final WebViewAssetLoader loader;

    OfflineGameAssets(Context context) {
        AssetManager assets = context.getApplicationContext().getAssets();
        loader = new WebViewAssetLoader.Builder()
                .setDomain(HOME_HOST)
                .addPathHandler("/", path -> {
                    String assetPath = GameAssetPath.resolve(path);
                    if (assetPath == null) {
                        return error(403, "Forbidden");
                    }
                    try {
                        String mime = GameAssetPath.mimeType(assetPath);
                        String encoding = mime.startsWith("text/") || mime.equals("application/json")
                                ? "UTF-8" : null;
                        return new WebResourceResponse(mime, encoding, 200, "OK",
                                Collections.singletonMap("Cache-Control", "no-store"),
                                assets.open(assetPath, AssetManager.ACCESS_STREAMING));
                    } catch (IOException exception) {
                        return error(404, "Not Found");
                    }
                })
                .build();
    }

    static boolean isLocal(Uri uri) {
        return "https".equalsIgnoreCase(uri.getScheme())
                && HOME_HOST.equalsIgnoreCase(uri.getHost())
                && (uri.getPort() == -1 || uri.getPort() == 443)
                && uri.getUserInfo() == null;
    }

    WebResourceResponse intercept(Uri uri, String method) {
        if (!isLocal(uri)) return error(403, "Forbidden");
        if (!"GET".equals(method)) return error(405, "Method Not Allowed");
        WebResourceResponse response = loader.shouldInterceptRequest(uri);
        return response == null ? error(404, "Not Found") : response;
    }

    private static WebResourceResponse error(int status, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", status, reason,
                Collections.singletonMap("Cache-Control", "no-store"),
                new ByteArrayInputStream(new byte[0]));
    }
}
