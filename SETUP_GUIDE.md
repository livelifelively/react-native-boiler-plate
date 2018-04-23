# React-native style guide

## 1. Initial project

```
react-native init PROJECT_NAME
```

## 2. Setup git

```
cd PROJECT_NAME
git init
git remote add origin GIT_REPO_URL
git add .
git commit -m "Initialise Project"
git push -u origin master
```

## 3. Update display and package name

Optional.

```
npm install -g react-native-rename
react-native-rename "NEW DISPLAY NAME" -b NEW_PACKAGE_NAME
```

In Xcode:

Project => General => Bundle Identifier = NEW_PACKAGE_NAME

## 4. Add reference to Android SDK path

Create file **local.properties** in ./android with the following contents:

```
ndk.dir=PATH_TO_NDK_BUNDLE
sdk.dir=PATH_TO_SDK
```

## 5. Generate android app signing

```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Enter a password and your details.

Move **my-release-key.keystore** to ./android/app/

In ./android/gradle.properties, add:

```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=******
MYAPP_RELEASE_KEY_PASSWORD=******
```

In .**/android/app/build.gradle**, add (in android.defaultConfig object):

```
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
```

In the same file add (in android.buildTypes.release object):

```
signingConfig signingConfigs.release
```

## 6. Install dependencies

Remove what you don't need.

```
yarn add prop-types react-native-simple-components react-native-simple-animators react-native-vector-icons react-native-firebase redux react-redux redux-saga react-native-router-flux react-native-fbsdk react-native-google-signin react-native-image-picker react-native-image-resizer react-native-permissions react-native-geocoder react-native-fs axios
```

## 7. Link and setup dependencies

### Android

#### react-native-vector-icons

In **./android/app/build.gradle** (at bottom of file add):

```
project.ext.vectoricons = [
iconFontNames: [ 'MaterialIcons.ttf' ] // add whatever other icons you want

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
]
```

#### react-native-firebase

Add Firebase app in [Firebase console](https://console.firebase.google.com/).

Get hash keys from the keytool commands.

```
react-native link react-native-firebase

keytool -exportcert -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore

keytool -exportcert -list -v -alias my-key-alias -keystore ./android/app/my-release-key.keystore
```

From Firebase console, download **google-services.json** to
./android/app/

In **./android/build.gradle** add (in buildscript.dependencies):

```
classpath 'com.google.gms:google-services:3.1.1'
```

Same file as above add (to allprojects.repositories):

```
maven {
    url 'https://maven.google.com'
}
```

In **./android/app/build.gradle** add (at very bottom):

```
apply plugin: 'com.google.gms.google-services'
```

Same file as above add (to dependencies)(remove what you don't need):

```
compile "com.google.android.gms:play-services-base:11.4.2"
compile "com.google.firebase:firebase-core:11.4.2"
compile "com.google.firebase:firebase-auth:11.4.2"
compile "com.google.firebase:firebase-database:11.4.2"
compile "com.google.firebase:firebase-storage:11.4.2"
```

In **./android/app/src/main/java/MainApplication.java** add (at top):

```
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
```

Same file as above add (under packages)(remove what you don't need):

```
new RNFirebaseAuthPackage(),
new RNFirebaseDatabasePackage(),
new RNFirebaseStoragePackage()
```

#### react-native-fbsdk

```
react-native link react-native-fbsdk
```

In **./android/app/src/main/java/MainApplication.java** add (at top):

```
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
```

Same file as above add (beginning of class):

```
private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
}
```

Same file as above overwrite:

```
@Override
public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
}
```

Same file as above add (in packages):

```
new FBSDKPackage(mCallbackManager),
```

In **./android/app/src/main/java/MainActivity.java** add (top of file):

```
import android.content.Intent;
```

Same file, add (at beginning of class):

```
@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
}
```

The following steps are from [here](https://developers.facebook.com/docs/facebook-login/android?sdk=maven):

In **./android/build.gradle** add (to allprojects.repositories object):

```
mavenCentral()
```

In **./android/app/build.gradle** add (to dependencies):

```
compile 'com.facebook.android:facebook-login:[4,5)'
```

In **./android/app/src/main/res/values/strings.xml** add:

```
<string name="facebook_app_id">FACEBOOK_APP_ID</string>
<string name="fb_login_protocol_scheme">FACEBOOK_LOGIN_SCHEME</string>
```

In **./android/app/src/main/AndroidManifest.xml** add (within <application> tags):

```
<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
<activity android:name="com.facebook.FacebookActivity" android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation" android:label="@string/app_name" />
<activity android:name="com.facebook.CustomTabActivity" android:exported="true">
    <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="@string/fb_login_protocol_scheme" />
    </intent-filter>
</activity>
```

Add [Facebook](https://developers.facebook.com/apps/) app.

Add app name and main activity name to Facebook app.

Add key hashes to Facebook app:

```
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

Run the above command twice. First with android as password and second with your project password.

```
keytool -exportcert -alias my-key-alias -keystore ./android/app/my-release-key.keystore | openssl sha1 -binary | openssl base64
```

#### react-native-google-signin

```
react-native link react-native-google-signin
```

In **./android/app/build.gradle** add (dependencies):

```
compile(project(":react-native-google-signin")){
exclude group: "com.google.android.gms" // very important
}
compile 'com.google.android.gms:play-services-auth:11.4.2'
```

Add web client id to **./src/config/index.js**.

Add dev and release SHA-1 to Firebase project:

```
keytool -exportcert -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
keytool -exportcert -list -v -alias my-key-alias -keystore ./android/app/my-release-key.keystore
```

#### react-native-permissions

```
react-native link react-native-permissions
```

Add permissions to **./android/app/src/main/AndroidManifest.xml** (remove what you don't need):

```
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_INTERAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_INTERAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

#### react-native-geocoder

```
react-native link react-native-geocoder
```

#### react-native-image-picker

```
react-native link react-native-image-picker
```

#### react-native-image-resizer

```
react-native link react-native-image-resizer
```

#### react-native-fs

TODO: not necessary with RN 0.54.

```
react-native link react-native-fs
```

### iOS

Add Cocoapods:

```
cd ios
pod init
```

in PodFile => delete duplicate PROJECT_NAME-tvOSTests within main project target

```
pod update
```

#### react-native-vector-icons

In Xcode, drag fonts to project (eg. MaterialIcons.ttf and any other custom fonts you want)
In ./ios/PROJECT_NAME/info.plist, UIAppFonts (within array) add:

```
<string>MaterialIcons.ttf</string>
```

#### react-native-firebase

Add ios app to firebase console.
Download GoogleServices-Info.plist to ./ios
In podfile, uncomment platform :ios, '9.0' (change to '8.0' if on Mac version < 10.2)
Same file add (remove what you don't need):

```
pod 'Firebase', '4.3.0' // necessary for pod to use latest firebase modules
pod 'Firebase/Core'
pod 'Firebase/Auth'
pod 'Firebase/Database'
pod 'Firebase/Storage'
```

```
cd ios pod install && pod update
```

In **./ios/PROJECT_NAME/AppDelegate.m** (at top of file) add:

```
#import <Firebase.h>
```

Same file (before return):

```
[FIRApp configure];
```

#### react-native-fbsdk

Follow the steps [here](https://developers.facebook.com/docs/facebook-login/ios).
In XCode, from Documents/FacebookSDK, drag Bolts.framework and FBSDKShareKit.framework into Frameworks folder.

#### react-native-google-signin

In XCode add **./node_modules/react-native-google-signin/iosRNGoogleSignin.xcodeproj** to your xcode project.
In your project build phase -> Link binary with libraries step, add libRNGoogleSignin.a, AddressBook.framework, SafariServices.framework, SystemConfiguration.framework and libz.tbd.
Drag and drop contents of the **./ios/GoogleSdk** folder to your XCode project. (make sure Copy items if needed is ticked) (copy this folder to **./ios/** if you don't see it there).
Configure URL types in the Info panel:

* add Identifier and URL Schemes with your REVERSED\*CLIENT_ID (found inside the plist)
* add Identifier and URL Schemes set to your bundle id
  Add top of AppDelegate.m:

```
#import <RNGoogleSignin/RNGoogleSignin.h>
```

Replace openUrl function with:

```
- (BOOL)application:(UIApplication *)application openURL:(NSURL \_)url
sourceApplication:(NSString \*)sourceApplication annotation:(id)annotation {
return [[FBSDKApplicationDelegate sharedInstance] application:application
openURL:url
sourceApplication:sourceApplication
annotation:annotation
]
||
[RNGoogleSignin application:application
openURL:url
sourceApplication:sourceApplication
annotation:annotation
];
}
```

Add ios client id to **./src/config/index.js**.

#### react-native-permissions

Add necessary permissions to Info.plist (remove what you don't need):

```
<key>NSCameraUsageDescription</key>
<string></string>
<key>NSLocationWhenInUseUsageDescription</key>
<string></string>
<key>NSPhotoLibraryUsageDescription</key>
<string></string>
```

#### react-native-geocoder

No extra steps necessary (linked in Android setup).

#### react-native-image-picker

If link command did not work in android step, link manually:

* Drag node*modules/react-native-image-picker/ios/*.workspace into iOS project in Xcode and add libRNX.a to Link Binary ...
* For iOS 10+, Add the NSPhotoLibraryUsageDescription, NSCameraUsageDescription, and NSMicrophoneUsageDescription (if allowing video) keys to your Info.plist with strings describing why your app needs these permissions. Note: You will get a SIGABRT crash if you don't complete this step

#### react-native-image-resizer

react-native link react-native-image-resizer (unless done in android setup)
_Sometimes this does not work, in this case:
Drag node_modules/react-native-image-resizer/ios/_.workspace into iOS project in Xcode and add libRNX.a to Link Binary ...

#### react-native-fs

TODO: Not necessary in RN 0.54.
No extra steps necessary (linked in Android setup).

## 8. Set SDK version (ANDROID)

In **./android/app/build.gradle**:

```
android.compileSdkVersion: 25
android.buildToolsVersion: "25.0.3"
android.defaultConfig.targetSdkVersion: 25
depenencies (com.android.support): 25.0.0
```

## 9. Copy the source files

```
git clone https://github.com/shaunsaker/react-native-boilerplate.git src
```

In **./src/index.js** replace content with:

```
import { AppRegistry } from "react-native";
import App from "./src/App";

AppRegistry.registerComponent("PROJECT_NAME", () => App);
```

```
rm ./App.js
sudo rm -R ./src/.git
```

Delete the code you don't need.

## 10. Setup extra app icons

Copy the following to **./package.json**:

```
"rnpm": {
    "assets": [
        "./src/assets/fonts",
    ]
}
```

Copy **./src/assets/fonts/AppIcons.ttf** to

* ./android/app/src/assets/fonts
* ./ios/PROJECT_NAME/

## 11. Enable Firebase authentication methods

Remove what you don't need.

* Anonymous
* Facebook
* Google (TODO: you may need to download a new google-services.json and GoogleService-Info.plist)
* Email
* Phone

## 12. Add custom icons

TODO.