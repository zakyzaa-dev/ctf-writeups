## TL;DR

Password diverifikasi dengan membandingkan hasil XOR tiap byte input (key `0x55`) terhadap array byte `myBytes` yang sudah ditentukan di source code. Karena sifat XOR yang _self-inverse_, flag bisa langsung didapat dengan meng-XOR ulang `myBytes` menggunakan key yang sama.

---

## Challenge Description

> Dr. Evil gave me a book called Applied Cryptography by Bruce Schneier, and I learned this really cool encryption system. This will be the strongest vault door in Dr. Evil's entire evil volcano compound for sure! Well, I didn't exactly read the _whole_ book, but I'm sure there's nothing important in the last 750 pages.
> — Minion #3091

**Files/Attachment**: `VaultDoor6.java`
**Target**: Source code analysis (tidak ada remote service)

---

## Recon

- [x] Diberikan source code Java lengkap, bukan binary — jadi langsung bisa dianalisis secara statis tanpa perlu decompile.
- [x] Fungsi `checkPassword` adalah titik validasi utama yang menentukan `Access granted` atau `Access denied`.
- [x] Terdapat array `myBytes` berisi 32 byte hex yang dibandingkan terhadap input user.

---

## Analysis

Fokus ke logika inti verifikasi password:

```java
for (int i=0; i<32; i++) {
    if (((passBytes[i] ^ 0x55) - myBytes[i]) != 0) {
        return false;
    }
}
return true;
```

Dianalisis operator precedence-nya: untuk setiap index `i`, hasil `(passBytes[i] ^ 0x55) - myBytes[i]` **harus sama dengan 0** agar tidak langsung `return false`. Jika semua index lolos pengecekan ini, baru `checkPassword` mengembalikan `true`.

Dari situ diturunkan persamaan:

```
(passBytes[i] ^ 0x55) - myBytes[i] == 0
(passBytes[i] ^ 0x55) == myBytes[i]
```

Karena XOR bersifat **self-inverse** (`A ^ K ^ K = A`), maka jika `A ^ K = B`, otomatis `A = B ^ K`. Diterapkan ke persamaan di atas:

```
passBytes[i] = myBytes[i] ^ 0x55
```

Artinya, password yang benar bisa langsung didapat dengan meng-XOR ulang setiap elemen `myBytes` menggunakan key yang sama (`0x55`), tanpa perlu brute force sama sekali.

---

## Exploitation

### Step 1 — Ekstraksi array byte dari source code

```java
byte[] myBytes = {
    0x3b, 0x65, 0x21, 0xa , 0x38, 0x0 , 0x36, 0x1d,
    0xa , 0x3d, 0x61, 0x27, 0x11, 0x66, 0x27, 0xa ,
    0x21, 0x1d, 0x61, 0x3b, 0xa , 0x2d, 0x65, 0x27,
    0xa , 0x36, 0x33, 0x30, 0x30, 0x63, 0x63, 0x61,
};
```

### Step 2 — Script Python untuk reverse XOR

```python
XOR_KEY = 0x55
FLAG = ""
MY_BYTES = [
    0x3b, 0x65, 0x21, 0xa , 0x38, 0x0 , 0x36, 0x1d,
    0xa , 0x3d, 0x61, 0x27, 0x11, 0x66, 0x27, 0xa ,
    0x21, 0x1d, 0x61, 0x3b, 0xa , 0x2d, 0x65, 0x27,
    0xa , 0x36, 0x33, 0x30, 0x30, 0x63, 0x63, 0x61,
]

for byte in MY_BYTES:
    FLAG += chr(byte ^ XOR_KEY)

print("Flag: academy{" + FLAG + "}")
```

### Step 3 — Verifikasi

Password hasil decode dimasukkan ke program Java asli (dibungkus format `academy{...}` sesuai parsing input di `main()`), dan menghasilkan `Access granted.`

---

## Obstacles / Dead Ends

Tidak ada rabbit hole berarti — begitu operator precedence di kondisi `if` dipahami dan sifat self-inverse XOR dikenali, solusi langsung didapat tanpa perlu brute force atau pendekatan lain.

---

## Flag

```
academy{n0t_mUcH_h4rD3r_tH4n_x0r_********}
```

---

## Key Takeaways

- XOR bersifat _self-inverse_: `A ^ K ^ K = A`. Jika sebuah nilai hasil XOR diketahui beserta key-nya, nilai asli bisa langsung direkonstruksi tanpa brute force.
- Penting membaca operator precedence dengan teliti pada kondisi bersarang (`((A ^ K) - B) != 0`) sebelum menyimpulkan syarat yang harus dipenuhi.
- Soal reverse engineering dengan source code tersedia (bukan hanya binary) sering kali bisa diselesaikan murni lewat analisis statis tanpa menjalankan program sama sekali.

---

## References

- [What is XOR](https://dev.to/mspilari/understanding-the-xor-operator-a-powerful-tool-in-computing-1517)
