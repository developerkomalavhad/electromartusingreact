import dell from "../assets/images/dell.jpg";
import hp from "../assets/images/hp.jpg";
import iphone from "../assets/images/iphone.jpg";
import lenovo from "../assets/images/lenovo.jpg";
import samsung from "../assets/images/samsung.jpg";
import vivo from "../assets/images/vivo.jpg";

const imageMap = { dell, hp, iphone, lenovo, samsung, vivo };

export function resolveProductImage(image) {
  return imageMap[image] || image;
}

export function getProductId(product) {
  return product._id || product.id;
}
