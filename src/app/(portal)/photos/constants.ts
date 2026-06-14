import type { PhotoSlotType } from "@/lib/photos/data";

export const slotTypeLabels: Record<PhotoSlotType, string> = {
  representative: "대표 이미지",
  interior: "매장 인테리어",
  treatment: "시술 갤러리",
};

export const slotTypeDescriptions: Record<PhotoSlotType, string> = {
  representative:
    "매장 목록과 상세 페이지 상단에 노출되는 대표 이미지입니다. 4:3 비율로 표시되며, 위치를 조정해 노출 영역을 맞출 수 있습니다.",
  interior: "매장 내부 분위기를 보여주는 사진입니다. 최대 3장까지 등록할 수 있습니다.",
  treatment:
    "시술 결과물을 보여주는 사진입니다. 메뉴 카테고리를 태그할 수 있으며 최대 4장까지 등록할 수 있습니다.",
};

export const MAX_PHOTO_SIZE_BYTES = 8 * 1024 * 1024;
