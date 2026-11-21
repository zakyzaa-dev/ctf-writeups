# Write-up: VaultDoor3

## TL;DR

Diberikan sebuah file source code Java `VaultDoor3.java` yang memvalidasi password dengan cara mengacak posisi karakter ke dalam sebuah buffer, lalu membandingkannya dengan string tertentu. User diharuskan untuk membalik proses pengacakan tersebut untuk mendapatkan password asli yang menjadi flag.

---

## Challenge Description

> (tempel deskripsi challenge dari platform di sini)

**Files/Attachment**: `VaultDoor3.java`
**Target**: -

---

## Recon

- [x] Download file `VaultDoor3.java`, lalu baca source code-nya karena challenge ini hanya berupa source code tanpa binary maupun service yang berjalan.
- [x] Program meminta input berupa password dengan format `academy{...}`. Bagian di dalam kurung kurawal diambil menggunakan `substring`, lalu dikirim ke fungsi `checkPassword()`.
- [x] Password harus memiliki panjang tepat 32 karakter, dan hasil pengacakannya dibandingkan dengan string `jU5t_a_sna_3lpm16gd4e_u_4_m7re42`.

---

## Analysis

Pada fungsi `main`, input dari user dipotong dengan `substring("academy{".length(), userInput.length()-1)`, sehingga yang dicek oleh `checkPassword()` hanyalah isi di dalam `academy{}` saja.

_(tempel screenshot source code VaultDoor3.java di sini)_

Pada fungsi `checkPassword()`, password tidak dibandingkan secara langsung. Password terlebih dahulu dipindahkan ke `buffer` dengan urutan index yang diacak menggunakan empat buah for-loop, kemudian `buffer` tersebut dibandingkan dengan string target. Artinya, string target `jU5t_a_sna_3lpm16gd4e_u_4_m7re42` adalah password yang sudah teracak, dan tugas kita adalah mengembalikannya ke urutan semula.

---

## Exploitation

### Step 1 — Pahami alur pengacakan

Berikut adalah bagian kode yang melakukan pengacakan pada password.

```java
char[] buffer = new char[32];
int i;
for (i=0; i<8; i++) {
    buffer[i] = password.charAt(i);
}
for (; i<16; i++) {
    buffer[i] = password.charAt(23-i);
}
for (; i<32; i+=2) {
    buffer[i] = password.charAt(46-i);
}
for (i=31; i>=17; i-=2) {
    buffer[i] = password.charAt(i);
}
String s = new String(buffer);
return s.equals("jU5t_a_sna_3lpm16gd4e_u_4_m7re42");
```

Pada intinya, setiap loop memiliki perannya masing-masing.

| Loop | Range index              | Aturan                                                   |
| ---- | ------------------------ | -------------------------------------------------------- |
| 1    | 0 - 7                    | `buffer[i] = password[i]` (tidak berubah)                |
| 2    | 8 - 15                   | `buffer[i] = password[23-i]` (urutan dibalik)            |
| 3    | 16, 18, ..., 30 (genap)  | `buffer[i] = password[46-i]` (ditukar antar index genap) |
| 4    | 17, 19, ..., 31 (ganjil) | `buffer[i] = password[i]` (tidak berubah)                |

Loop 3 hanya mengisi index genap dan loop 4 hanya mengisi index ganjil, sehingga tidak ada index yang saling menimpa dan semua 32 posisi pada `buffer` terisi.

### Step 2 — Balikkan transformasi

Karena semua loop hanya memindahkan posisi karakter (permutasi) tanpa mengubah nilai karakternya, proses ini sangat mudah untuk dibalik. Setiap baris `buffer[i] = password[f(i)]` cukup kita tulis ulang menjadi `password[f(i)] = encoded[i]`, dimana `encoded` adalah string target `jU5t_a_sna_3lpm16gd4e_u_4_m7re42`. Tidak perlu melakukan brute force sama sekali.

Berikut adalah solver yang saya buat.

```javascript
const FLAG_ENCODED = "jU5t_a_sna_3lpm16gd4e_u_4_m7re42";
let PASSWORD = [];

let i;

for (i = 0; i < 8; i++) {
  PASSWORD[i] = FLAG_ENCODED.at(i);
}
for (; i < 16; i++) {
  PASSWORD[23 - i] = FLAG_ENCODED.at(i);
}
for (; i < 32; i += 2) {
  PASSWORD[46 - i] = FLAG_ENCODED.at(i);
}
for (i = 31; i >= 17; i -= 2) {
  PASSWORD[i] = FLAG_ENCODED.at(i);
}

FLAG = "academy{" + PASSWORD.join("") + "}";
console.log(`Encoded Flag (${FLAG_ENCODED.length}): ${FLAG_ENCODED}`);
console.log(`Decoded Flag (${PASSWORD.length}): ${PASSWORD.join("")}`);
console.log(`Recovered Flag with format: ${FLAG}`);
```

### Step 3 — Jalankan solver

Setelah solver dijalankan, didapatkan password asli yang sudah dikembalikan ke urutan semula.

```
Encoded Flag (32): jU5t_a_sna_3lpm16gd4e_u_4_m7re42
Decoded Flag (32): jU5t_a_s1mpl3_an4gr4m_4_u_********
Recovered Flag with format: academy{jU5t_a_s1mpl3_an4gr4m_4_u_********}
```

_(tempel screenshot output solver di sini)_

### Step 4 — Verifikasi

Untuk memastikan hasilnya benar, jalankan `VaultDoor3.java` dan masukkan flag yang telah didapatkan. Jika benar, program akan menampilkan `Access granted.`

_(tempel screenshot hasil verifikasi di sini)_

---

## Obstacles / Dead Ends

- Tidak ada kesusahan yang berarti. Hanya perlu teliti pada arah mapping index (index pada `buffer` dengan index pada `password`), karena jika salah arah, hasil yang didapat akan tetap terlihat acak.

---

## Flag

```
academy{jU5t_a_s1mpl3_an4gr4m_4_u_********}
```

---

## Key Takeaways

- Validasi yang hanya mengacak posisi karakter (permutasi) bersifat reversible, sehingga string target sudah cukup untuk merekonstruksi input aslinya tanpa perlu brute force.
- Cara tercepat untuk membalik pengacakan adalah dengan menyalin struktur loop yang sama, lalu menukar arah assignment dari `buffer[i] = password[f(i)]` menjadi `password[f(i)] = encoded[i]`.
- Perhatikan bagian input yang benar-benar dicek oleh program. Pada challenge ini hanya isi di dalam `academy{}` yang diperiksa, jadi prefix dan suffix harus ditambahkan kembali saat submit.

---

## References

- Tidak ada, solve dilakukan langsung dari source code yang diberikan.
