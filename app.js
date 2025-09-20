import readline from "readline-sync";
import chalk from "chalk"; 
import { menu } from "./menu.js";
import { rupiah } from "./format-rupiah.js";
import { addToCart } from "./addToCart.js";

function main() {
  console.log(chalk.green.bold("\n=== Selamat Datang ==="));
  console.log(chalk.cyan("=== Silahkan Pilih Menu ==="));

  const newMenu = menu.map((value) => ({ ...value }));

  newMenu.forEach((value, index) => {
    console.log(
      chalk.yellow(`${index + 1}. ${value.nama} = Rp${rupiah(value.harga)}`)
    );
  });

  let cart = [];

  while (true) {
    let input = readline.questionInt(
      chalk.magenta(
        "Pilih angka menu yang ingin ditambahkan ke keranjang (0 untuk keluar): "
      )
    );

    if (input === 0) break;
    if (input < 1 || input > newMenu.length) {
      console.log(chalk.red("⚠ Tidak ada menu yang dipilih"));
      continue;
    }

    let inputJumlah = readline.questionInt(
      chalk.blue(`Masukan jumlah ${newMenu[input - 1].nama}: `)
    );

    if (inputJumlah < 1) {
      console.log(chalk.red("⚠ Jumlah tidak boleh kurang dari 1"));
      continue;
    }

    let resultMenu = newMenu[input - 1];
    cart = addToCart(cart, resultMenu, inputJumlah);

    let total = resultMenu.harga * inputJumlah;
    console.log(
      chalk.green(
        `${resultMenu.nama} x ${inputJumlah} dengan total Rp.${rupiah(
          total
        )} ditambahkan ke keranjang.\n`
      )
    );

    let confirm = readline.question("Mau tambah barang? (y/n): ");
    if (confirm.toLowerCase() === "n") break;
  }

  console.log(chalk.bold("\n=== Keranjang Belanja ==="));
  cart.forEach((value, index) => {
    console.log(
      chalk.yellow(
        `${index + 1}. ${value.nama} x ${value.jumlah} = Rp.${rupiah(
          value.total
        )}`
      )
    );
  });

  let bills = cart.reduce((acc, item) => acc + item.total, 0);
  console.log(chalk.cyan(`\n💰 Total: Rp.${rupiah(bills)}`));

  let pay = readline.questionInt(chalk.blue("Masukan Jumlah Pembayaran: "));

  // kalau uang pas
  if (pay === bills) {
    console.log(chalk.green(`✅ Pembayaran berhasil dengan uang pas Rp.${rupiah(pay)}`));
  } 
  // kalau uang lebih
  else if (pay > bills) {
    const change = pay - bills;
    console.log(chalk.green(`✅ Pembayaran berhasil!`));
    console.log(chalk.yellow(`Kembalian anda: Rp.${rupiah(change)}`));
  } 
  // kalau uang kurang
  else {
    console.log(chalk.red(`❌ Uang anda kurang Rp.${rupiah(bills - pay)}`));
    console.log(chalk.cyan("1. Kurangi jumlah barang"));
    console.log(chalk.cyan("2. Batalkan pembelian"));

    const decisionPay = readline.questionInt("Pilih apa: ");
    if (decisionPay === 2) {
      console.log(chalk.red.bold("🚫 Pembelian dibatalkan."));
      return;
    }

    if (decisionPay === 1) {
      // tampilkan keranjang
      console.log(chalk.bold("\n=== Keranjang Belanja ==="));
      cart.forEach((value, index) => {
        console.log(
          chalk.yellow(
            `${index + 1}. ${value.nama} x ${value.jumlah} = Rp.${rupiah(
              value.total
            )}`
          )
        );
      });

      const reduceItem = readline.questionInt("Mau kurangi menu nomor berapa: ");
      if (reduceItem < 1 || reduceItem > cart.length) {
        console.log(chalk.red("⚠ Barang tidak ditemukan"));
        return;
      }

      const reduceSumItem = readline.questionInt("Mau kurangi berapa: ");
      if (reduceSumItem < 1 || reduceSumItem > cart[reduceItem - 1].jumlah) {
        console.log(chalk.red("⚠ Jumlah tidak valid"));
        return;
      }

      cart[reduceItem - 1].jumlah -= reduceSumItem;
      cart[reduceItem - 1].total =
        cart[reduceItem - 1].harga * cart[reduceItem - 1].jumlah;

      if (cart[reduceItem - 1].jumlah === 0) {
        cart.splice(reduceItem - 1, 1);
      }

      bills = cart.reduce((acc, item) => acc + item.total, 0);
      console.log(chalk.cyan(`\n💰 Total baru: Rp.${rupiah(bills)}`));

      const newPay = readline.questionInt("Masukan Jumlah Pembayaran: ");

      if (newPay < bills) {
        console.log(chalk.red("❌ Uang anda masih kurang, transaksi gagal."));
      } else if (newPay === bills) {
        console.log(chalk.green(`✅ Pembayaran berhasil dengan uang pas Rp.${rupiah(newPay)}`));
      } else {
        const change = newPay - bills;
        console.log(chalk.green("✅ Pembayaran berhasil!"));
        console.log(chalk.yellow(`Kembalian anda: Rp.${rupiah(change)}`));
      }
    }
  }
}

main();
