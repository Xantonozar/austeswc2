// Script to mark specific photos as selected for Eco Capture Round 2
// Run with: node scripts/mark-selected-photos.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
}

// Selected photos data - 32 photos across 17 participants
const selectedData = [
    {
        _id: "69cab9779f8fa0cec132af2d",
        name: "Nazifa Anjum orni",
        selectedPhotoIds: [
            "eswc_competition_photos/ofwxxcvqioeegnhvuet7",
            "eswc_competition_photos/lzlrdzznsyam838db0lx"
        ]
    },
    {
        _id: "69caaf397f2c732ce8b5630a",
        name: "Ajmain Mohammad Nafi",
        selectedPhotoIds: [
            "eswc_competition_photos/h4zqk936uigpandvgasq",
            "eswc_competition_photos/hi9tmwprzgom8pmf08q8",
            "eswc_competition_photos/aec9jlfhubbaugqecj5u"
        ]
    },
    {
        _id: "69caa66502f0724cb7331aa3",
        name: "Rezaul Karim Rahat",
        selectedPhotoIds: [
            "eswc_competition_photos/rvtbptb0wndgaei7l45q"
        ]
    },
    {
        _id: "69caa113b8a1d9c739d93515",
        name: "Naimum Mukim Marzan",
        selectedPhotoIds: [
            "eswc_competition_photos/kezlnixejgfrjzntmnsq",
            "eswc_competition_photos/kl65bujlxcq8wpugcrn3"
        ]
    },
    {
        _id: "69ca8dc5a79a38c516434f2d",
        name: "Saikat Mahmud",
        selectedPhotoIds: [
            "eswc_competition_photos/ed7rlfvtcaqklicummno",
            "eswc_competition_photos/rao3xsrimpoprphyq8jq"
        ]
    },
    {
        _id: "69c96110c7efcb493c49150a",
        name: "Abrar Hasnat Mollah",
        selectedPhotoIds: [
            "eswc_competition_photos/opmehstq4otn5ogvnyof"
        ]
    },
    {
        _id: "69c9004cf1df18787b13d57c",
        name: "M Sajjad Kabir",
        selectedPhotoIds: [
            "eswc_competition_photos/ug7mlde100dbrvu3suhr",
            "eswc_competition_photos/tcg0bhhmhupxrrbnf4lo"
        ]
    },
    {
        _id: "69c6f6ea18f373b6d21c8028",
        name: "Saria Tasnin Aboni",
        selectedPhotoIds: [
            "eswc_competition_photos/ua2euqwb08t3isahdudi",
            "eswc_competition_photos/tidyrk9legra7pam6mrq"
        ]
    },
    {
        _id: "69c3f6c407ea17d158649ad5",
        name: "Raiyan Islam",
        selectedPhotoIds: [
            "eswc_competition_photos/b9t8e7bvzhkkltkclvus"
        ]
    },
    {
        _id: "69c38fc3109c33735a732017",
        name: "MD. FARHAN SHAHRIA ARIK",
        selectedPhotoIds: [
            "eswc_competition_photos/vuuhvpq109qipzde8ull",
            "eswc_competition_photos/irkrk2lihlqlsddrczab"
        ]
    },
    {
        _id: "69c2f0d4d056e44517e1d1cc",
        name: "YEASIN ARAFAT TASIM",
        selectedPhotoIds: [
            "eswc_competition_photos/tdywktyckt3lrnoshrea",
            "eswc_competition_photos/tkfoiuyo2ufz6dnpolla",
            "eswc_competition_photos/g1lar1nhikxzqber6riz"
        ]
    },
    {
        _id: "69c2dbc0e31b39569dada434",
        name: "Rafi Shahriar Mazumder",
        selectedPhotoIds: [
            "eswc_competition_photos/ezm3v717f9cniopow4e7",
            "eswc_competition_photos/l2yepelq70n8fqlnqkqs",
            "eswc_competition_photos/fjfke7f2crtdvjycteqn"
        ]
    },
    {
        _id: "69c2544c5aec075e75fedca0",
        name: "Tasnia Jahan",
        selectedPhotoIds: [
            "eswc_competition_photos/mabe7kuy6ek1fuvi0jg4"
        ]
    },
    {
        _id: "69c1aba91907fd71addd48c9",
        name: "Ahnaf Tahmid",
        selectedPhotoIds: [
            "eswc_competition_photos/jdofmnlojmxrl3xbnzae",
            "eswc_competition_photos/c3v3h8obbmt4ygllpga5"
        ]
    },
    {
        _id: "69c106b0f92f800f226f1b91",
        name: "Md Fahad Sarker",
        selectedPhotoIds: [
            "eswc_competition_photos/xe0siup2a5rtjkmu4mbk",
            "eswc_competition_photos/tf5nzwo9crn52muouxtd"
        ]
    },
    {
        _id: "69b86b85e40b9b120a95fd5f",
        name: "Md. Tahir Raiyan Rakeen",
        selectedPhotoIds: [
            "eswc_competition_photos/silbzvowlu8lnv5c30zh",
            "eswc_competition_photos/gzrz1qro4yuyzm1zyia2"
        ]
    },
    {
        _id: "69b784147ba1520e2cf0ccd3",
        name: "Mir Muntasir Mugdho",
        selectedPhotoIds: [
            "eswc_competition_photos/ssu3l6hneyyxe6gnbxaj"
        ]
    }
];

async function markPhotosAsSelected() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, { dbName: 'austeswc' });
        console.log('Connected to MongoDB\n');

        const Competition = mongoose.connection.collection('competitions');

        let totalParticipantsUpdated = 0;
        let totalPhotosSelected = 0;

        console.log('='.repeat(60));
        console.log('MARKING SELECTED PHOTOS FOR ECO CAPTURE ROUND 2');
        console.log('='.repeat(60) + '\n');

        for (const participant of selectedData) {
            const objectId = new mongoose.Types.ObjectId(participant._id);
            
            // Get current document
            const doc = await Competition.findOne({ _id: objectId });
            
            if (!doc) {
                console.log(`❌ Not found: ${participant.name} (${participant._id})`);
                continue;
            }

            if (doc.type !== 'eco-capture') {
                console.log(`⚠️ Skipping (not eco-capture): ${participant.name}`);
                continue;
            }

            // Mark only the specified photos as selected
            let photosSelectedCount = 0;
            const updatedPhotos = doc.photos.map(photo => {
                const isSelected = participant.selectedPhotoIds.includes(photo.publicId);
                if (isSelected) {
                    photosSelectedCount++;
                }
                return {
                    ...photo,
                    selected: isSelected
                };
            });

            // Update the document - set status to 'selected' and update photos
            const result = await Competition.updateOne(
                { _id: objectId },
                { 
                    $set: { 
                        photos: updatedPhotos,
                        status: 'selected'
                    } 
                }
            );

            if (result.modifiedCount > 0) {
                const fee = photosSelectedCount * 300;
                console.log(`✅ ${participant.name}`);
                console.log(`   📷 ${photosSelectedCount} photo(s) selected | Fee: ${fee} BDT`);
                totalParticipantsUpdated++;
                totalPhotosSelected += photosSelectedCount;
            } else {
                console.log(`⚠️ ${participant.name}: No changes made`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total participants updated: ${totalParticipantsUpdated}`);
        console.log(`Total photos marked as selected: ${totalPhotosSelected}`);
        console.log(`Total fee to collect: ${totalPhotosSelected} × 300 = ${totalPhotosSelected * 300} BDT`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

markPhotosAsSelected();
