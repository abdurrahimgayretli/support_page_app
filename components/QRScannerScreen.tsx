import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import InputArea from "./InputArea";

const QRScannerScreen = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [scanned, setScanned] = useState(false);

  const handleChangeText = (text: string) => {
    setQrCode(text);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    navigation.navigate("SupportPage", { qrCode: data });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View className="flex-1">
      <BarCodeScanner
        className="flex-1"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View className="w-[50%] self-center flex-row justify-center items-center">
          <InputArea
            onChangeText={handleChangeText}
            value={qrCode}
            placeholder="Write QR Code"
            type="writeQR"
            src={require("../assets/qr-code.png")}
          />
          <Pressable
            className={
              "w-10 mt-6 h-[7vh] ml-2 bg-green-500 rounded-lg justify-center items-center"
            }
            onPress={() => {
              navigation.navigate("SupportPage", { qrCode: qrCode })}}
          >
            <Text className="text-white">OK</Text>
          </Pressable>
        </View>
      </BarCodeScanner>
    </View>
  );
};

export default QRScannerScreen;
