package top.xcymm3.adv;

import org.junit.Test;
import static org.junit.Assert.*;

public class GameAssetPathTest {
    @Test public void mapsRootAndStaticDirectories() {
        assertEquals("index.html", GameAssetPath.resolve(""));
        assertEquals("help/index.html", GameAssetPath.resolve("help/"));
        assertEquals("_next/static/chunks/app.js", GameAssetPath.resolve("_next/static/chunks/app.js"));
        assertEquals("assets/夜雨.webp", GameAssetPath.resolve("assets/夜雨.webp"));
    }

    @Test public void rejectsTraversalAndAmbiguousPaths() {
        for (String path : new String[] {"../secret", "a/../../secret", "a/./b", "/secret",
                "a\\b", "a\0b", "%2e%2e/secret", "%252e%252e/secret"}) {
            assertNull(path, GameAssetPath.resolve(path));
        }
        assertNull(GameAssetPath.resolve(null));
    }

    @Test public void servesWebFontsAndAudioWithCorrectTypes() {
        assertEquals("text/javascript", GameAssetPath.mimeType("chunk.js"));
        assertEquals("text/css", GameAssetPath.mimeType("style.css"));
        assertEquals("image/webp", GameAssetPath.mimeType("scene.webp"));
        assertEquals("audio/wav", GameAssetPath.mimeType("bgm.wav"));
        assertEquals("font/woff2", GameAssetPath.mimeType("font.woff2"));
        assertEquals("application/octet-stream", GameAssetPath.mimeType("unknown"));
    }
}
