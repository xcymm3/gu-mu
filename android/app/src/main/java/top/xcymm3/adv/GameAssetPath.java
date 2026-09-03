package top.xcymm3.adv;

import java.util.Locale;

/** Maps an already URI-decoded path to a packaged file, never a filesystem path. */
final class GameAssetPath {
    private GameAssetPath() {}

    static String resolve(String path) {
        if (path == null || path.startsWith("/") || path.contains("\\")
                || path.contains("\0") || path.contains("%")) {
            return null;
        }
        for (String segment : path.split("/")) {
            if (segment.equals(".") || segment.equals("..")) {
                return null;
            }
        }
        return path.isEmpty() || path.endsWith("/") ? path + "index.html" : path;
    }

    static String mimeType(String path) {
        String extension = path.substring(path.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        return switch (extension) {
            case "html" -> "text/html";
            case "js", "mjs" -> "text/javascript";
            case "css" -> "text/css";
            case "json", "map" -> "application/json";
            case "txt" -> "text/plain";
            case "svg" -> "image/svg+xml";
            case "webp" -> "image/webp";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "ico" -> "image/x-icon";
            case "wav" -> "audio/wav";
            case "mp3" -> "audio/mpeg";
            case "ogg" -> "audio/ogg";
            case "woff2" -> "font/woff2";
            case "woff" -> "font/woff";
            case "ttf" -> "font/ttf";
            default -> "application/octet-stream";
        };
    }
}
