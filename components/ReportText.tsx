import React from "react";
import { Text, Image, View } from "react-native";

type Props = {
  text: string;
  select: boolean;
  index: number;
  onChangeCheck: (i: number) => void;
};

const ReportText = ({ text, select, onChangeCheck, index }: Props) => {
  return (
    <View onTouchStart={()=>{onChangeCheck(index)}}>
      <Text  className="text-xs">
        {text}
        {select && (
          <Image className="w-5 h-5" source={require("../assets/check.png")} />
        )}
      </Text>
    </View>
  );
};

export default ReportText;
