plugins {
    id("com.android.application")
}

android {
    // This shell contains only Java; do not resolve an unused Kotlin compiler.
    enableKotlin = false
    namespace = "top.xcymm3.adv"
    compileSdk = 36
    buildToolsVersion = "36.1.0"

    defaultConfig {
        applicationId = "top.xcymm3.adv"
        minSdk = 23
        targetSdk = 36
        versionCode = 2
        versionName = "0.2.0-rc.2-offline"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = true
    }

    // Package the complete Next.js export, including the root-absolute /_next URLs.
    sourceSets.getByName("main").assets.directories.add(rootProject.file("../out").path)
    androidResources {
        // AAPT's default pattern excludes underscore-prefixed directories such as _next.
        ignoreAssetsPattern = "!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~"
    }
}

val verifyWebExport by tasks.registering {
    val exportDirectory = rootProject.file("../out")
    inputs.dir(exportDirectory).optional()
    doLast {
        check(exportDirectory.resolve("index.html").isFile &&
                exportDirectory.resolve("_next/static").isDirectory &&
                exportDirectory.resolve("audio").isDirectory) {
            "Missing complete web export. Run pnpm build from the repository root before building Android."
        }
    }
}
tasks.named("preBuild") { dependsOn(verifyWebExport) }

dependencies {
    implementation("androidx.activity:activity:1.13.0")
    // 1.16+ requires API 24; retain this application's API 23 compatibility.
    implementation("androidx.webkit:webkit:1.15.0")
    testImplementation("junit:junit:4.13.2")
}
