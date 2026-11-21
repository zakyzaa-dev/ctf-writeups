## TL;DR

Player diminta untuk melakukan recovery flag yang sudah diencode dengan beberapa teknik dan melakukan replacing character sedari `-` menjadi `_` , dan `()`  menjadi `{}`

---

## Challenge Description

> Can you reverse a series of Linux text transformations to recover the original flag? Start searching for the flag here **`nc chatelaine.cylabacademy.net 28826`**
> 

**Files/Attachment**: -
**Target**: **`nc chatelaine.cylabacademy.net 28826`**

---

## Recon

- [x]  Server mengembalikan string flag yang sudah diencode dengan ROT dan juga base64
- [x]  Kita harus melakukan beberapa char replace untuk mendapatkan flag yang utuh

---

## Analysis

Saat kita menghubungkan ke server, terdapat clue jika kita diminta memasukan command linux yang tepat agar bisa mengembalikan flag ke bentuk awalnya.

```bash
===Welcome to the Text Transformations Challenge!===

Your goal: step by step, recover the original flag.
At each step, you'll see the transformed flag and a hint.
Enter the correct Linux command to reverse the last transformation.
```

---

## Exploitation

### Step 1 — Base64 decode

Di step pertama, kita diminta untuk melakukan decoding dari string yang sudah diencode menggunakan base64. Kita bisa menggunakan `base64 -d`  untuk melakukan decoding

```bash
--- Step 1 ---
Current flag: KTQ4czA3M3M4LWZhMDFnQHplMHNmYTRlRy1nazNnLXRhMWZlcmlyRShsenJxbnBu
Hint: Base64 encoded the string.
Enter the Linux command to reverse it:
```

jika command yang kita masukkan benar, maka server akan mengembalikan `Correct!`

```bash
--- Step 1 ---
Current flag: KTQ4czA3M3M4LWZhMDFnQHplMHNmYTRlRy1nazNnLXRhMWZlcmlyRShsenJxbnBu
Hint: Base64 encoded the string.
Enter the Linux command to reverse it: base64 -d
Correct!
```

dan current flag pada step ke 2 akan berganti.

```bash
Current Flag: `)48s073s8-fa01g@ze0sfa4eG-gk3g-ta1ferirE(lzrqnpn`
```

### Step 2 — Reverse Flag

Setelah encoded string di step pertama berhasil didecode, pada step 2 kita akan mendapat string yang sudah di decode namun bentuknya masih teracak, dan kita diminta untuk melakukan reverse string nya.

```bash
--- Step 2 ---
Current flag: )48s073s8-fa01g@ze0sfa4eG-gk3g-ta1ferirE(lzrqnpn
Hint: Reversed the text.
Enter the Linux command to reverse it:
```

Gunakan command `rev`  untuk melakukan reverse string.

```bash
--- Step 2 ---
Current flag: )48s073s8-fa01g@ze0sfa4eG-gk3g-ta1ferirE(lzrqnpn
Hint: Reversed the text.
Enter the Linux command to reverse it: rev
Correct!
```

easy right? whwhwh

```bash
Current Flag: `npnqrzl(Eriref1at-g3kg-Ge4afs0ez@g10af-8s370s84)`
```

### Step 3 — Replace Dashes

Pada step ke 3, kita diminta untuk mengganti char `-`  yang ada pada string flag menjadi `_ (underscore)` . 

```bash
--- Step 3 ---
Current flag: npnqrzl(Eriref1at-g3kg-Ge4afs0ez@g10af-8s370s84)
Hint: Replaced underscores with dashes.
Enter the Linux command to reverse it:
```

Gunakan command `tr "-" "_"` untuk melakukan replace character. Command tersebut digunakan untuk melakukan translation dari character awal yang berupa dashes menjadi underscores.

```bash
--- Step 3 ---
Current flag: npnqrzl(Eriref1at-g3kg-Ge4afs0ez@g10af-8s370s84)
Hint: Replaced underscores with dashes.
Enter the Linux command to reverse it: tr "-" "_"
Correct!
```

```bash
Current Flag: `npnqrzl(Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84)`
```

## Step 4 — Replace Parentheses

Setelah semua dashes telah diganti dengan underscores, kita masih diminta untuk melakukan replacing lagi, yaitu melakukan replace Parentheses `()` menjadi Curly Bracket `{}` 

```bash
--- Step 4 ---
Current flag: npnqrzl(Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84)
Hint: Replaced curly braces with parentheses.
Enter the Linux command to reverse it:
```

Sama seperti pada step 3, kita bisa menggunakan `tr` kembali, dan hanya mengganti character apa yang ingin kita replace.

```bash
--- Step 4 ---
Current flag: npnqrzl(Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84)
Hint: Replaced curly braces with parentheses.
Enter the Linux command to reverse it: tr "()" "{}"
Correct!
```

Tinggal 1 langkah lagi hingga kita mendapatkan flag utuh untuk challenge Undo ini

```bash
Current Flag: `npnqrzl{Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84}` 
```

## Step 5 — ROT 13 Decode

Langkah terakhir di challenge ini adalah dengan memasukan command linux untuk melakukan decoding ROT 13. Rot 13 / Rotate by 13 merupakan algoritma encoding yang melakukan pergeseran alphabet. ROT bisa dilakukan sebanyak jumlah alphabet yang tersedia yaitu 1 sampai dengan 26, dengan contoh ROT 2 akan melakukan pergeseran sebanyak 2 alphabet ke samping yang akan menjadikan `A = C`  `B = D` dan begitu seterusnya.

```bash
--- Step 5 ---
Current flag: npnqrzl{Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84}
Hint: Applied ROT13 to letters.
Enter the Linux command to reverse it:
```

Masih dengan command yang sama yaitu `tr` namun ada yang sedikit berbeda yaitu character yang akan di translate kan, karena kita akan melakukan pergeseran, maka gunakan `tr 'A-Za-z' 'N-ZA-Mn-za-m'` .

`'A-Za-z'` :  Menentukan semua huruf besar dan huruf kecil standar sebagai target yang akan diubah.

`'N-ZA-Mn-za-m'` : Mengganti huruf **A** hingga **M** menjadi **N** hingga **Z**, lalu memutar sisa huruf **N** hingga **Z** kembali menjadi **A** hingga **M**.

```bash
--- Step 5 ---
Current flag: npnqrzl{Eriref1at_g3kg_Ge4afs0ez@g10af_8s370s84}
Hint: Applied ROT13 to letters.
Enter the Linux command to reverse it: tr 'A-Za-z' 'N-ZA-Mn-za-m'
Correct!
```

Setelah semua langkah dilakukan dengan benar maka kita akan mendapatkan flag yang sudah terdecode

```bash
Congratulations! You've recovered the original flag:
>>> academy{Revers1ng_t3xt_Tr4nsf0rm@t10ns_********}
```

---

## Obstacles / Dead Ends

- Tidak ada sedikitpun kesulitan saat melakukan solving, hanya saja terkendala beberapa command linux yang belum diketahui

---

## Flag

```bash
academy{Revers1ng_t3xt_Tr4nsf0rm@t10ns_8f370f84}
```

---

## Key Takeaways

- Decoding ROT bisa dilakukan dengan mudah dengan membuka decoder online, namun karna kita diminta untuk memasukan command maka kita harus mencari tau command untuk melakukan decoding yaitu menggunakan `tr`
- Sudah tersedia banyak decoder online yang dapat mempermudah decoding, dan juga tersedia banyak source untuk mempelajari command baru seperti `tr`  untuk melakukan replacing character dan decoding ROT 13

---

## References

- Apa itu ROT13
- Base64 Encoding
- tr linux command
