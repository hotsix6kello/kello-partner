# Kello Public API Contract

This partner portal exposes read-only public catalog APIs for the Kello service. Kello should treat `stores.id` from this API as the partner store identifier and write it to `beauty_booking_requests.store_id` when a customer creates a booking.

## Store List

`GET /api/public/stores`

Returns stores owned by partners only when `partners.status = approved`, `partners.contract_status = signed`, and `partners.is_public = true`.

```json
{
  "ok": true,
  "stores": [
    {
      "id": "store-uuid",
      "name": "Store name",
      "address": "Store address",
      "description": "Public store intro",
      "businessTypes": ["nail"],
      "category": "nail",
      "representativePhoto": {
        "id": "photo-uuid",
        "slotType": "representative",
        "slotIndex": 0,
        "url": "https://..."
      },
      "priceRange": { "min": 30000, "max": 80000 },
      "openingSummary": {
        "days": [1, 2, 3, 4, 5],
        "text": "주 5일 10:00-19:00"
      }
    }
  ]
}
```

## Store Detail

`GET /api/public/stores/{storeId}`

Returns one approved, signed, public partner store.

```json
{
  "ok": true,
  "store": {
    "id": "store-uuid",
    "storeId": "store-uuid",
    "name": "Store name",
    "phone": "010-0000-0000",
    "address": "Store address",
    "description": "Public store intro",
    "businessTypes": ["nail"],
    "photos": [],
    "categories": [
      {
        "id": "category-uuid",
        "name": "Gel Nail",
        "orderIndex": 0,
        "menuItems": [
          {
            "id": "menu-item-uuid",
            "storeId": "store-uuid",
            "categoryId": "category-uuid",
            "name": "Basic gel",
            "durationMin": 60,
            "priceType": "fixed",
            "price": 50000,
            "priceMin": null,
            "priceMax": null,
            "options": []
          }
        ]
      }
    ],
    "menuItemIds": ["menu-item-uuid"]
  }
}
```

The detail response only includes approved photos and approved menu items where `visible = true`. The parent partner must be `status = approved`, `contract_status = signed`, and `is_public = true`. It does not expose `owner_id`, `partner_id`, review fields, storage paths, or internal booking notes.

## Availability

`GET /api/public/stores/{storeId}/availability?date=YYYY-MM-DD&menuItemId={menuItemId}`

Use `store.id` from the list/detail API as `storeId`, and an approved visible menu item `id` from detail as `menuItemId`.
Availability is available only for stores whose parent partner is `status = approved`, `contract_status = signed`, and `is_public = true`.

```json
{
  "ok": true,
  "date": "2026-06-20",
  "storeId": "store-uuid",
  "menuItemId": "menu-item-uuid",
  "slots": [
    { "time": "10:00", "available": true },
    { "time": "10:30", "available": false, "reason": "break_time" }
  ],
  "closed": false
}
```

## Booking Creation Contract

This partner portal does not create customer bookings. Kello should create the booking in its own booking flow and store the partner linkage in `beauty_booking_requests.store_id`.

Required values:

- `storeId`: `stores.id` from `/api/public/stores` or `/api/public/stores/{storeId}`
- `menuItemId`: approved visible `menuItems[].id` from the detail API
- `bookingDate`: date used in availability lookup
- `bookingTime`: selected available slot time
- `serviceName`: selected menu item name
- `customerName`
- `customerEmail`
- `customerPhone` when available
- `requestNote` or customer request text
- `selectedOptionIds` when menu options are selected

Kello booking insert mapping:

- `beauty_booking_requests.store_id = storeId`
- `beauty_booking_requests.primary_service_id = menuItemId`
- `beauty_booking_requests.primary_service_name = serviceName`
- `beauty_booking_requests.booking_date = bookingDate`
- `beauty_booking_requests.booking_time = bookingTime`
- `beauty_booking_requests.customer_request = requestNote`
- selected options should map to `add_on_ids`, `add_on_names`, and add-on price fields when used

Before inserting a booking, Kello should call the availability API again for the selected `storeId`, `menuItemId`, and date, then confirm the chosen slot is still available.

## Exposure Rules

- Do not render stores unless `partners.status = approved`, `partners.contract_status = signed`, and `partners.is_public = true`.
- Do not render pending or rejected photos.
- Do not render pending or rejected menu items.
- Do not render invisible menu items.
- Do not depend on `owner_id` or `partner_id` in Kello UI.
- Do not expose `internal_note`, review reason, reviewer ID, or other admin-only fields.
- Treat public API data as read-only. Partner edits must continue through the partner portal and admin review flow.
