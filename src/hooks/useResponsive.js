import {useWindowDimensions} from 'react-native';

export default function useResponsive() {
    const {width, height} = useWindowDimensions();
    const isTablet = width >= 768;
    const isHorizontal = width > height;
    return {
        width, 
        height, 
        isTablet, 
        isHorizontal,
        columnas: isTablet ? 2 : 1,
        anchoTarjeta: isTablet ? 320 : Math.min(width * 0.72, 300),
        paddingHorizontal: isTablet ? 32 : 16, 
    };
}