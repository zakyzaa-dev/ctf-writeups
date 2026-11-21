## TL;DR

User diminta mengirimkan karakter `e` (kode ASCII desimal 101 / hex 0x65) sebanyak `1751` kali berurutan tanpa spasi. Jika sesuai, program akan menampilkan flag.

---

## Challenge Description

> Can you conjure the right bytes? The program's source code can be downloaded **here**
> 

**Files/Attachment**: `app.py`
**Target**: -

---

## Recon

- [x]  Diberikan source code `app.py` dan dilakukan analisis terhadap alur kerja program
- [x]  Program memeriksa apakah input sama dengan `"\x65"` * `1751` (yaitu karakter 'e' sebanyak 1751 kali tanpa spasi). Jika sesuai, isi file flag akan ditampilkan.

---

## Analysis

Program yang dijalankan di server memiliki source code seperti dibawah.

```python
while(True):
  try:
    print('⊹──────[ BYTEMANCY-1 ]──────⊹')
    print("☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐")
    print()
    print('Send me ASCII DECIMAL 101 1751 times, side-by-side, no space.')
    print()
    print("☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐")
    print('⊹─────────────⟡─────────────⊹')
    user_input = input('==> ')
    if user_input == "\x65"*1751:
      print(open("./flag.txt", "r").read())
      break
    else:
      print("That wasn't it. I got: " + str(user_input))
      print()
      print()
      print()
  except Exception as e:
    print(e)
    break
```

Challenge sederhana di mana program hanya meminta karakter `e` sebanyak `1751` kali ("eee...."), lalu membaca dan mencetak isi file flag jika input cocok.

**Hasil**: Flag didapatkan jika permintaan dari program terpenuhi

---

## Exploitation

### Step 1 — Mencoba input string acak

Dicoba dengan memasukan string dengan contoh `test` kemudian server mengembalikan.

```bash
zakyza@zakynsa:~/CTF/Pico/Pico-Phamy/GeneralSkill/bytemancy1$ python3 app.py
⊹──────[ BYTEMANCY-1 ]──────⊹
☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐

Send me ASCII DECIMAL 101 1751 times, side-by-side, no space.

☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐☉⟊☽☈⟁⧋⟡☍⟐
⊹─────────────⟡─────────────⊹
==> test
That wasn't it. I got: test
```

Sesuai dengan source code yang diberikan.

### Step 2 — Membuat Exploit

Kemudian, exploit dibangun dengan menggunakan library `pwn` untuk melakukan otomasi pengiriman payload ke server remote.

```python
from pwn import *

context.log_level = "error"

HOST = input("Masukan host: ").strip()
PORT = input("Masukkan port: ").strip()

payload = "e" * 1751

r = remote(HOST, PORT)
r.recvuntil(b'==>')
r.sendline(payload.encode())
response = r.recvline().decode().strip()

if "academy" in response:
        print("<" + "=" * 5 + ">")
        print(f"Flag Found: {response}")
        print("<" + "=" * 5 + ">")
```

exploit akan menghubungkan ke server remote yang sudah diinput. Payload akan dikirim segera setelah `==>` terdeteksi. Payload dibuat berupa string karakter `e` sebanyak 1751 karakter ("e" * 1751, setara 1751 byte ASCII). Response ditangkap dan didecode, jika pada response terdapat kata `academy` program akan berhenti dan menampilkan flag yang didapat.

---

## Obstacles / Dead Ends

- Tidak ditemukan kesulitan berarti karena alur program jelas, tidak di-obfuscate, dan tidak memakai logika yang berbelit.

---

## Flag

```
academy{h0w_m4ny_e's???_********}
```

---

## Key Takeaways

- Pastikan membaca alur kerja dari program sebelum membangun exploit, agar memahami dimana celah bisa ditemukan
- Encoding ASCII dan hex dapat digunakan untuk mengelabui (mungkin untuk pemula) player untuk mencari tau input apa yang diminta oleh program

---

## References

- None
