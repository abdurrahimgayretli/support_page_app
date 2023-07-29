import { View, Image, TextInput, ImageSourcePropType } from "react-native";
import React from "react";

type Props = {
  placeholder?: string;
  value?: string;
  type?: string;
  src?: ImageSourcePropType;
  handleSubmit?: () => void;
  onChangeText?: (text: string) => void;
};

const InputArea = ({
  placeholder,
  src,
  type,
  handleSubmit,
  value,
  onChangeText,
}: Props) => {
  return (
    <View
      className={`mt-6 px-5 flex-row bg-pink-500 rounded-lg w-full ${
        type !== "area" ? "h-[7vh]" : "h-[20vh] items-start"
      } `}
    >
      <TextInput
        editable={type !== "qr"}
        onChangeText={onChangeText}
        value={value}
        multiline={type === "area"}
        className={`flex-1 ${
          type !== "area" ? "w-[90%] pr-2" : "pt-2"
        } text-white`}
        placeholderTextColor={"white"}
        placeholder={placeholder}
      />
      {type !== "area" && (
        <View className="h-8 w-8 self-center" onTouchStart={handleSubmit}>
          <Image
            className="w-full h-full"
            tintColor={"white"}
            source={src || require("./../assets/icon.png")}
          />
        </View>
      )}
    </View>
  );
};

export default InputArea;
