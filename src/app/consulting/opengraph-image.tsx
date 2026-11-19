import {
  renderSocialImage,
  socialImageAlt,
  socialImageSize,
  socialImageType,
} from "../../lib/og/social-image.tsx";

export const alt = socialImageAlt("consulting");
export const size = socialImageSize;
export const contentType = socialImageType;
export default function SocialImage() {
  return renderSocialImage("consulting");
}
