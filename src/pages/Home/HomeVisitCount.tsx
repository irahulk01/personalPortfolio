import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { databases, DATABASE_ID, COLLECTION_ID, DOCUMENT_ID } from '../../appwrite/appwriteConfig';

const useVisitCount = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      const newUserId = uuidv4();
      localStorage.setItem('userId', newUserId);
      incrementViewCount();
    } else {
      getVisitCount();
    }
  }, []);

  const incrementViewCount = () => {
    databases.getDocument(DATABASE_ID, COLLECTION_ID, DOCUMENT_ID)
      .then((response) => {
        const currentVisitCount = response.visitCount || 0;
        const updatedVisitCount = currentVisitCount + 1;
        setViewCount(updatedVisitCount);
        localStorage.setItem('viewCount', updatedVisitCount.toString());
        databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          DOCUMENT_ID,
          { "visitCount": updatedVisitCount }
        ).catch((error) => {
          console.error('Error updating document:', error);
        });
      })
      .catch((error) => {
        console.error('Error fetching document:', error);
      });
  };

  const getVisitCount = () => {
    databases.getDocument(DATABASE_ID, COLLECTION_ID, DOCUMENT_ID)
      .then((response) => {
        const currentVisitCount = response.visitCount || 0;
        setViewCount(currentVisitCount);
      })
      .catch((error) => {
        console.error('Error fetching document:', error);
      });
  };

  return viewCount;
};

export default useVisitCount;
