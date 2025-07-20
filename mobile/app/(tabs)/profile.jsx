import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import api from "../../constants/axiosInstance";
import { useState } from 'react';
import Loader from '../../components/Loader';
import styles from "../../assets/styles/profileStyles"
import COLORS from '../../constants/colors';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const { token } = useSelector((state)=>state.auth);
  const router = useRouter();

  const fetchData = async ()=>{
    try {
      setIsLoading(true);
      const {data} = await api.get("/books/user",{headers : {Authorization : `Bearer ${token}`}});
      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:",error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    }finally{
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async(bookId)=>{
    try {
      setDeleteBookId(bookId);
      const {data} = await api.delete(`/books/${bookId}`,{headers :{Authorization : `Bearer ${token}`}})
      setBooks(books.filter((book)=>book._id !==bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally{
      setDeleteBookId(null);
    }
  }
  const confirmDelete = (bookId) => {
    Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) },
    ]);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
   const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations 📚</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}