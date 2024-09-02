// src/app/api/getAudioList/route.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../../config/firebase"; // Firebase config dosyanızda 'db' referansı olması gerekir.

export async function GET() {
    try {
        // Firestore'da koleksiyon referansı oluşturun
        const collectionRef = collection(db, 'educationResources');

        // Koleksiyondaki tüm dökümanları çekin
        const querySnapshot = await getDocs(collectionRef);

        if (!querySnapshot.empty) {
            // Dökümanları işleyin
            const result = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    category: data.category,
                    coverImageUrl: data.coverImageUrl,
                    videoUrl: data.videoUrl,
                };
            });

            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            // Koleksiyon boşsa
            return new Response(JSON.stringify({ error: 'No documents found' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching documents:', error.message); // Ayrıntılı hata mesajını günlüğe kaydet
        return new Response(JSON.stringify({ error: 'Failed to get documents', details: error.message }), { status: 500 });
    }
}
