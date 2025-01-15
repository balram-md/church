import Metrics from '../metrics/screen';

const size = {
    font6: Metrics.screenWidth * (6 / 365),
    font8: Metrics.screenWidth * (8 / 365),
    font10: Metrics.screenWidth * (10 / 365),
    font12: Metrics.screenWidth * (12 / 365),
    font14: Metrics.screenWidth * (14 / 365),
    font15: Metrics.screenWidth * (14.5 / 365),
    font16: Metrics.screenWidth * (16 / 365),
    font18: Metrics.screenWidth * (18 / 365),
    font20: Metrics.screenWidth * (20 / 365),
};

const weight :{full:'900',low:'100',semi:'300',medium:'700',bold:'bold'}= {
  full: '900',
  low:'100',
  semi:'300',
  medium:'700',
  bold:'bold'

};

const type = {
    PoppinsBold: 'Poppins-Bold',
};

export default {
  size,
  weight,
  type,
};
