export function addToCart(cart, menuItem, jumlah) {
  const order = {
    nama: menuItem.nama,
    harga: menuItem.harga,
    jumlah,
    total: menuItem.harga * jumlah,
  };
  return [...cart, order];
}
