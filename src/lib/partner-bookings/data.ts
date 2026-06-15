import type { SupabaseClient } from "@supabase/supabase-js";
import { requireApprovedPartnerStore, type Store } from "@/lib/store/data";
import type { Database } from "@/lib/supabase/database.types";

type BookingRow = Database["public"]["Tables"]["beauty_booking_requests"]["Row"];
type BookingImageRow = Database["public"]["Tables"]["beauty_booking_request_images"]["Row"];

export type PartnerBookingListItem = Pick<
  BookingRow,
  | "id"
  | "booking_date"
  | "booking_time"
  | "created_at"
  | "customer_email"
  | "customer_name"
  | "payment_status"
  | "primary_service_name"
  | "quote_service_name"
  | "quote_status"
  | "status"
>;

export type PartnerBookingImage = {
  id: string;
  label: string;
  url: string;
};

export type PartnerBookingDetail = {
  booking: BookingRow;
  images: PartnerBookingImage[];
  store: Store;
};

function uniqImages(images: PartnerBookingImage[]) {
  const seen = new Set<string>();

  return images.filter((image) => {
    if (seen.has(image.url)) {
      return false;
    }

    seen.add(image.url);
    return true;
  });
}

function toBookingListItem(booking: BookingRow): PartnerBookingListItem {
  return {
    id: booking.id,
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    created_at: booking.created_at,
    customer_email: booking.customer_email,
    customer_name: booking.customer_name,
    payment_status: booking.payment_status,
    primary_service_name: booking.primary_service_name,
    quote_service_name: booking.quote_service_name,
    quote_status: booking.quote_status,
    status: booking.status,
  };
}

function getPublicStorageUrl(
  supabase: SupabaseClient<Database>,
  bucketName: string,
  storagePath: string,
) {
  return supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl;
}

function toBookingImages(
  supabase: SupabaseClient<Database>,
  booking: BookingRow,
  imageRows: BookingImageRow[],
): PartnerBookingImage[] {
  const storedImages = imageRows.map((image) => ({
    id: image.id,
    label: image.original_file_name ?? image.image_type,
    url: getPublicStorageUrl(supabase, image.bucket_name, image.storage_path),
  }));

  const inlineImages: PartnerBookingImage[] = [
    ...(booking.image_urls ?? []).map((url, index) => ({
      id: `image-url-${index}`,
      label: "고객 첨부 이미지",
      url,
    })),
    booking.current_image_url
      ? {
          id: "current-image-url",
          label: "현재 이미지",
          url: booking.current_image_url,
        }
      : null,
    booking.style_image_url
      ? {
          id: "style-image-url",
          label: "희망 스타일",
          url: booking.style_image_url,
        }
      : null,
  ].filter((image): image is PartnerBookingImage => Boolean(image?.url));

  return uniqImages([...storedImages, ...inlineImages]);
}

export async function getPartnerBookings(
  supabase: SupabaseClient<Database>,
): Promise<{ bookings: PartnerBookingListItem[]; store: Store }> {
  const store = await requireApprovedPartnerStore(supabase);

  const { data, error } = await supabase
    .from("beauty_booking_requests")
    .select("*")
    .eq("store_id", store.id)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to load partner bookings", error);
    throw new Error("예약 목록을 불러오지 못했습니다.");
  }

  return { bookings: (data ?? []).map(toBookingListItem), store };
}

export async function getPartnerBookingDetail(
  supabase: SupabaseClient<Database>,
  bookingId: string,
): Promise<PartnerBookingDetail | null> {
  const store = await requireApprovedPartnerStore(supabase);

  const { data: booking, error } = await supabase
    .from("beauty_booking_requests")
    .select("*")
    .eq("id", bookingId)
    .eq("store_id", store.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load partner booking detail", error);
    throw new Error("예약 상세를 불러오지 못했습니다.");
  }

  if (!booking) {
    return null;
  }

  const { data: imageRows, error: imageError } = await supabase
    .from("beauty_booking_request_images")
    .select("*")
    .eq("request_id", booking.id)
    .order("created_at", { ascending: true });

  if (imageError) {
    console.error("Failed to load booking request images", imageError);
  }

  return {
    booking,
    images: toBookingImages(supabase, booking, imageRows ?? []),
    store,
  };
}
