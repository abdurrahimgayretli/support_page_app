import {
  View,
  Image,
  ScrollView,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import InputArea from "./InputArea";
import { Buffer } from "buffer";
import { BarCodeScanner } from "expo-barcode-scanner";

import AWS from "aws-sdk";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  POST_URL,
} from "@env";

import ReportText from "./ReportText";

export default function SupportPage({ navigation, route }: any) {
  const [qrCode, setQrCode] = useState<string>("");
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [locationText, setLocationText] = useState<string>("Your Location");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const [reportText, setReportText] = useState([
    { text: "Report Defective Vehicle", select: true },
    { text: "Report Wrong Parking", select: false },
    { text: "Report Other", select: false },
  ]);

  const [sentCheck, setSentCheck] = useState(false);

  const handleReportText = (i: number) => {
    const updateItems = [...reportText];
    updateItems.forEach((val, j) => {
      if (val.select === true) updateItems[j].select = false;
    });
    updateItems[i].select = true;

    setReportText(updateItems);
  };

  const handleChangeText = (text: string) => {
    setLocationText(text);
  };

  const handleChangeComment = (text: string) => {
    setComment(text);
  };

  const checkPermissions = async () => {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    const { status: cameraRollStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (
      cameraStatus !== "granted" ||
      cameraRollStatus !== "granted" ||
      locationStatus !== "granted"
    ) {
      Alert.alert(
        "Permission required",
        "Please grant camera, camera roll, and location permissions to use this feature."
      );
    }
  };

  const handleSelectQrCode = () => {
    navigation.navigate("QRScanner");
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].base64 || "");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const uploadFileFromPath = async (file: any, __filename: string) => {
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: "eu-central-1",
    });

    const fileManager = new AWS.S3();

    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Body: Buffer.from(file, "base64"),
      Key: `${__filename}`,
      ContentType: "image/jpeg",
    };

    const data = await fileManager.upload(params).promise();
    return data.Location;
  };

  const handleSendMessage = async () => {
    if (qrCode === "" || location.latitude === 0 || !photoUri) {
      setSentCheck(false);
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }
    const uploadPhoto = await uploadFileFromPath(photoUri, "support-photo.jpg");

    if (!uploadPhoto) {
      Alert.alert("Upload Error", "Failed to upload photo to AWS S3.");
      return;
    } else {
      setSentCheck(false);
      setQrCode("");
      setLocation({
        latitude: 0,
        longitude: 0,
      });
      setLocationText("Your Location");
      setPhotoUri(null);
      setComment("");

      Alert.alert("Success", "Your support message has been sent.");
    }

    const apiData = {
      phone: "5555555555",
      qrCode: qrCode,
      userLocation: {
        lat: location.latitude,
        lon: location.longitude,
        detail: locationText,
      },
      photo: uploadPhoto,
      type: {
        broken: reportText[0].select,
        parking: reportText[1].select,
        other: reportText[2].select,
      },
      message: comment,
    };

    // Send data to API
    try {
      const url = POST_URL;
      const headers = {
        "Content-Type": "application/json",
        phoneNumber: "5555555555",
        authCode: "testCode",
      };
      await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(apiData),
      });

      // if (response.ok) {
      //   Alert.alert("Success", "Your support message has been sent.");
      // } else {
      //   Alert.alert("Error", "Failed to send support message.");
      // }
    } catch (error) {
      console.error("Error sending support message:", error);
    }
  };

  const handleGetUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant location permission to get your current location."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const locDetails = await Location.reverseGeocodeAsync(location.coords);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }); // Erişim koordinatlarına atıyoruz
      setLocationText(locDetails[0].city + "/" + locDetails[0].country);
    } catch (error) {
      console.error("Error getting user location:", error);
      setLocation({
        latitude: 0,
        longitude: 0,
      });
      setLocationText("Failed to get location");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant camera permission to scan QR codes."
        );
      }
    })();
  }, []);

  useEffect(() => {
    const getLoc = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please grant location permission to get your current location."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        const locDetails = await Location.reverseGeocodeAsync(location.coords);
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }); // Erişim koordinatlarına atıyoruz
        setLocationText(locDetails[0].city + "/" + locDetails[0].country);
      } catch (error) {
        console.error("Error getting user location:", error);
        setLocation({
          latitude: 0,
          longitude: 0,
        });
        setLocationText("Failed to get location");
      }
    };
    getLoc();
  }, []);

  useEffect(() => {
    if (route.params !== undefined) {
      if (route.params.qrCode.length === 6) {
        setQrCode(route.params.qrCode);
      } else {
        Alert.alert(
          "Invalid QR Code",
          "Please make sure the QR code is 6 digits."
        );
      }
    }
  }, [route?.params]);
  return (
    <View className="bg-gray-700 h-full items-center">
      <View className="w-[90%] h-[90%]">
        <ScrollView>
          <InputArea
            value={locationText}
            onChangeText={handleChangeText}
            handleSubmit={handleGetUserLocation}
            placeholder="Your Location"
            type="map"
            src={require("../assets/map.png")}
          />
          <InputArea
            handleSubmit={handleSelectQrCode}
            placeholder="Select QR Code"
            type="qr"
            value={qrCode}
            src={require("../assets/qr-code.png")}
          />
          <View className="flex-row justify-between mt-5 h-[20vh]">
            <View
              className="w-[35%] bg-pink-500 rounded-xl justify-center items-center"
              onTouchStart={handleTakePhoto}
            >
              <Image
                className="w-10 h-10"
                tintColor={"white"}
                source={require("../assets/camera.png")}
              />
            </View>
            <View className="w-[60%] h-full bg-pink-500 rounded-xl grid grid-cols-3 p-4 justify-around">
              {reportText.map(
                (report: { text: string; select: boolean }, i: number) => (
                  <ReportText
                    key={i}
                    index={i}
                    text={report.text}
                    select={report.select}
                    onChangeCheck={handleReportText}
                  />
                )
              )}
            </View>
          </View>
          <InputArea
            onChangeText={handleChangeComment}
            value={comment}
            placeholder="Please write comment"
            type="area"
          />
          <View style={{ height: 30 }} />
        </ScrollView>
        <Pressable
          disabled={sentCheck}
          className={`w-full h-[7vh] ${
            !sentCheck ? "bg-pink-500" : "bg-green-400"
          }  rounded-lg justify-center items-center flex-row`}
          onPress={() => {
            setSentCheck(true);
            handleSendMessage();
          }}
        >
          <Text className="text-white">Send</Text>
          {sentCheck && (
            <ActivityIndicator color={"#0000ff"} className="pl-2" />
          )}
        </Pressable>
      </View>
    </View>
  );
}
