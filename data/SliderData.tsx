import { ImageSourcePropType } from "react-native";
export type ImageSliderType={
    title: string;
    image: ImageSourcePropType;
    description: string;
};
export const ImageSlider=[
    {
        title: 'Offer 1',
        image: require("@/assets/images/offer1.png"),
        description:'Offer1 is available'

    },
    {
        title: 'Offer 2',
        image: require("@/assets/images/offer2.png"),
        description:'Offer2 is available',
    },
];