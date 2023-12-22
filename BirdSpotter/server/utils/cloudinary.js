import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: 'bird-spotter', 
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_KEY_SECRET,
});

export const uploadImage = async (imageArr) => {
    let urlArr = [];
    console.log(imageArr);
    try {
        for (let i = 0; i < imageArr.length; i++) {
            let result = await cloudinary.v2.uploader.upload(imageArr[i]);
            urlArr.push(result.url);
        }
        return urlArr;
    } catch (error) {
        console.log(error)
    }
};

//const DKC = ["./images/dkc1.jpg", "./images/dkc2.jpg"];
//const Kirby = ['./images/kirby1.jpg'];
//const Skyward = ['./images/zelda.jpg', './images/zelda2.jpg', './images/zelda3.jpg'];


// const SS = ["./images/Pokemon Soulsilver Big Box CIB/1 - sjYs7He.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/2 - xHrMU9U.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/3 - K2r6Qnc.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/4 - k2JHBzZ.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/5 - 0Tw1cei.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/6 - Gwa5fi2.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/7 - 7Rt3v7J.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/8 - qSHUVem.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/9 - 6JVcAgW.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/10 - Um3u8s2.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/11 - OY9ACxa.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/12 - KXpsVmI.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/13 - zWJapiv.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/14 - zFX4b8l.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/15 - IZ4hojy.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/16 - uCUK1DL.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/17 - yu7ZIMV.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/18 - E8K5aCj.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/19 - aTn4IGm.jpg",
//             "./images/Pokemon Soulsilver Big Box CIB/20 - FWqGtva.jpg"
// ];

// const KI = ["./images/Kid Icarus Uprising Loose/1 - TSHUU5V.jpg",
//             "./images/Kid Icarus Uprising Loose/2 - zd6CTt2.jpg"
// ];

// const PP = ["./images/Pokemon Pearl Loose/3 - Us1jftd.jpg",
//             "./images/Pokemon Pearl Loose/4 - PJH0N2n.jpg"
// ];

// const LOZST = ["./images/The Legend of Zelda Spirit Tracks Loose/5 - 8a1X5bT.jpg",
//                "./images/The Legend of Zelda Spirit Tracks Loose/6 - Bwsdtt0.jpg"
// ];

// const PE = ["./images/Pokemon Emerald Loose/7 - wvvjqud.jpg",
//             "./images/Pokemon Emerald Loose/8 - iBswDHo.jpg"
// ];

// const SM = ["./images/Super Metroid Loose/9 - 06vFHDa.jpg",
//             "./images/Super Metroid Loose/10 - 9JphDBW.jpg",
//             "./images/Super Metroid Loose/11 - qr83ita.jpg"
// ];

// const SWBWII = ["./images/Star Wars Battlefront II PSP/12 - 5OlgB8T.jpg",
//                 "./images/Star Wars Battlefront II PSP/13 - Niuft3R.jpg",
//                 "./images/Star Wars Battlefront II PSP/14 - nk3PHVB.jpg",
//                 "./images/Star Wars Battlefront II PSP/15 - tsoUEx2.jpg",
//                 "./images/Star Wars Battlefront II PSP/16 - FShS6C5.jpg",
//                 "./images/Star Wars Battlefront II PSP/17 - ANlk5d7.jpg",
//                 "./images/Star Wars Battlefront II PSP/18 - uOSrY6f.jpg"
// ];

// const AQDS = ["./images/Nintendo 3DS Loose/19 - FpIz0L7.jpg",
//               "./images/Nintendo 3DS Loose/20 - komWl8u.jpg",
//               "./images/Nintendo 3DS Loose/21 - 7IwHgc7.jpg"
// ];

// const AOTFB = ["./images/Attack on Titan 2 Final Battle CIB/stockPhoto.jpg"];
// const FL = ["./images/Fossil League CIB/stockPhoto.jpg"];
// const MKD = ["./images/Mario Kart 8 Deluxe CIB/stockPhoto.jpg"];
// const NJG = ["./images/N64 Jungle Green/stockPhoto.jpg"];
// const PCON = ["./images/Pokemon Conquest Loose/stockPhoto.jpg"];
// const PC = ["./images/Pokemon Crystal Loose/stockPhoto.jpg"];
// const RT = ["./images/Rhythm Thief Loose/stockPhoto.jpg"];
// const SWRC = ["./images/Star Wars Republic Commando Collectors Edition CIB/stockPhoto.jpg"];
// const PW2 = ["./images/Pokemon White 2 Box Manual Only/stockPhoto.jpg"];
// const EOS = ["./images/Pokemon MD EoS/617iOqW0EkL.png"]

// const PFR = ["./images/Pokemon Firered/1 - iMCzAfu.jpg",
//              "./images/Pokemon Firered/2 - TnQZ9c3.jpg",
//              "./images/Pokemon Firered/3 - 8rVIMZ1.jpg",
//              "./images/Pokemon Firered/4 - ftP8Rar.jpg"
// ];

// console.log("Pokemon Soulsilver");
// console.log(await uploadImage(SS));
// console.log("Kid Icarus Uprising")
// console.log(await uploadImage(KI));
// console.log("Pokemon Pearl")
// console.log(await uploadImage(PP));
// console.log("Legend of Zelda")
// console.log(await uploadImage(LOZST));
// console.log("Pokemon Emerald")
// console.log(await uploadImage(PE));
// console.log("Super Metroid")
// console.log(await uploadImage(SM));
// console.log("Star Wars Battlefront II")
// console.log(await uploadImage(SWBWII));
// console.log("Aqua Blue 3DS")
// console.log(await uploadImage(AQDS));
// console.log("Attack on Titan Final Battle")
// console.log(await uploadImage(AOTFB));
// console.log("Fossil League")
// console.log(await uploadImage(FL));
// console.log("Mario Kart 8")
// console.log(await uploadImage(MKD));
// console.log("N64 Jungle Green")
// console.log(await uploadImage(NJG));
// console.log("Pokemon Conquest")
// console.log(await uploadImage(PCON));
// console.log("Pokemon Crystal")
// console.log(await uploadImage(PC));
// console.log("Rhythm Thief")
// console.log(await uploadImage(RT));
// console.log("Star Wars Republic Commando")
// console.log(await uploadImage(SWRC));
// console.log("Pokemon White 2")
// console.log(await uploadImage(PW2));
// console.log("Pokemon Mystery Dungeon Explorers of Sky")
// console.log(await uploadImage(EOS))
// console.log("Pokemon Firered")
// console.log(await uploadImage(PFR))//