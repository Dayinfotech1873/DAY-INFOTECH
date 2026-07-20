sed -i 's/increment(docRef, updateData)/updateDoc(docRef, updateData)/g' src/utils/db.ts
sed -i 's/increment(docRef, { ownerUnread: 0 })/updateDoc(docRef, { ownerUnread: 0 })/g' src/utils/db.ts
sed -i 's/increment(docRef, { userUnread: 0 })/updateDoc(docRef, { userUnread: 0 })/g' src/utils/db.ts
