export const dummyShops = [
  {
    id: 1,
    name: 'Keramik Dinoyo Makmur',
    description:
      'Toko keramik lokal yang menyediakan berbagai produk keramik khas Dinoyo.',
    address: 'Jl. MT Haryono, Dinoyo, Malang',
    instagram: '@keramikdinoyomakmur',
    tiktok: '@keramikdinoyomakmur',
    whatsapp: '081234567890',
    products_count: 2,
  },
  {
    id: 2,
    name: 'Dinoyo Ceramic House',
    description:
      'Menyediakan keramik handmade untuk kebutuhan rumah dan dekorasi.',
    address: 'Jl. Dinoyo, Malang',
    instagram: '@dinoyoceramichouse',
    tiktok: '@dinoyoceramichouse',
    whatsapp: '081298765432',
    products_count: 2,
  },
  {
    id: 3,
    name: 'Keramik Brawijaya',
    description:
      'Keramik lokal dengan berbagai pilihan desain dan bentuk.',
    address: 'Kawasan Keramik Dinoyo, Malang',
    instagram: '@keramikbrawijaya',
    tiktok: '@keramikbrawijaya',
    whatsapp: '082112223333',
    products_count: 2,
  },
]

export const dummyProducts = [
  {
    id: 1,
    name: 'Cangkir Keramik Dinoyo',
    shop: 'Keramik Dinoyo Makmur',
    category: 'Peralatan Makan',
    price: 35000,
    stock: 25,
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Piring Keramik Motif',
    shop: 'Keramik Dinoyo Makmur',
    category: 'Peralatan Makan',
    price: 45000,
    stock: 18,
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Vas Keramik Minimalis',
    shop: 'Dinoyo Ceramic House',
    category: 'Dekorasi',
    price: 85000,
    stock: 12,
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Gantungan Keramik',
    shop: 'Dinoyo Ceramic House',
    category: 'Souvenir',
    price: 15000,
    stock: 40,
    status: 'Aktif',
  },
  {
    id: 5,
    name: 'Mangkuk Keramik',
    shop: 'Keramik Brawijaya',
    category: 'Peralatan Makan',
    price: 40000,
    stock: 20,
    status: 'Aktif',
  },
  {
    id: 6,
    name: 'Pajangan Keramik',
    shop: 'Keramik Brawijaya',
    category: 'Dekorasi',
    price: 65000,
    stock: 15,
    status: 'Aktif',
  },
]

export const dummyWorkshops = [
  {
    id: 1,
    title: 'Workshop Membuat Keramik Dasar',
    instructor: 'Pengrajin Keramik Dinoyo',
    date: '05 Oktober 2026',
    time: '09.00 - 12.00',
    participants: 12,
    status: 'Terjadwal',
  },
  {
    id: 2,
    title: 'Workshop Dekorasi Keramik',
    instructor: 'Komunitas Keramik Dinoyo',
    date: '12 Oktober 2026',
    time: '13.00 - 16.00',
    participants: 8,
    status: 'Terjadwal',
  },
]

export const dummyVerifications = [
  {
    id: 1,
    name: 'Cangkir Keramik Dinoyo',
    shop: 'Keramik Dinoyo Makmur',
    result: 'Menunggu',
    confidence: '-',
  },
  {
    id: 2,
    name: 'Vas Keramik Minimalis',
    shop: 'Dinoyo Ceramic House',
    result: 'Disetujui',
    confidence: '94%',
  },
  {
    id: 3,
    name: 'Pajangan Keramik',
    shop: 'Keramik Brawijaya',
    result: 'Menunggu',
    confidence: '-',
  },
  {
    id: 4,
    name: 'Mangkuk Keramik',
    shop: 'Keramik Brawijaya',
    result: 'Disetujui',
    confidence: '91%',
  },
]