import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: "1", name: "Computadoras", icon: "desktop-outline", count: "12.450 productos" },
  { id: "2", name: "Celulares", icon: "phone-portrait-outline", count: "8230 productos" },
  { id: "3", name: "Audio", icon: "headset-outline", count: "5670 productos" },
  { id: "4", name: "Cámaras", icon: "camera-outline", count: "3420 productos" },
  { id: "5", name: "Wearables", icon: "watch-outline", count: "4590 productos" },
  { id: "6", name: "Gaming", icon: "game-controller-outline", count: "6780 productos" },
];

const PRODUCTS = [
  {
    id: "1",
    name: 'MacBook Pro 14" M3 Pro - Laptop de alto rendimiento',
    price: "$9.562.500",
    oldPrice: "$11.250.000",
    discount: "-15%",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500",
  },
  {
    id: "2",
    name: "Auriculares Inalámbricos Premium - Cancelación de ruido",
    price: "$1.080.000",
    oldPrice: "$1.350.000",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
  },
  {
    id: "3",
    name: "iPhone 15 Pro Max - 256GB Titanio Azul",
    price: "$5.400.000",
    oldPrice: null,
    discount: null,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=500",
  },
  {
    id: "4",
    name: "Cámara Canon EOS R5 - Profesional Full Frame",
    price: "$15.795.000",
    oldPrice: "$17.550.000",
    discount: "-10%",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500",
  },
];

const Home: React.FC = () => {
  const router = useRouter();
  const { token, logout, user } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />

      <View style={styles.header}>
        <Text style={styles.logo}>Lubix</Text>
        
        <View style={styles.headerRightActions}>
          {token ? (
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => router.push("/Index" as any)}
            >
              <Ionicons name="person-circle-outline" size={26} color="#00e676" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.headerTextBtn} 
                onPress={() => router.push("/Login" as any)}
              >
                <Ionicons name="person-outline" size={14} color="#9ca3af" style={{ marginRight: 4 }} />
                <Text style={styles.headerLinkText}>Ingresar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.headerRegisterBtn} 
                onPress={() => router.push("/register" as any)}
              >
                <Text style={styles.headerRegisterText}>Registrarse</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.cartIconBtn}>
            <Ionicons name="cart-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos, marcas y más..."
              placeholderTextColor="#4b5563"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={20} color="#0b0f19" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <View style={styles.tagContainer}>
              <Ionicons name="pricetag-outline" size={12} color="#fbbf24" />
              <Text style={styles.tagText}>Oferta Especial</Text>
            </View>
            <Text style={styles.heroTitle}>Mega Sale de Tecnología</Text>
            <Text style={styles.heroSubtitle}>Hasta 50% de descuento en productos seleccionados</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Ver ofertas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.thankYouCard}>
              <Text style={styles.thankYouText}>Thank You for Shopping With us!</Text>
              <Text style={styles.onlineText}>(online)</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías Principales</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
              <View style={styles.categoryIconCircle}>
                <Ionicons name={cat.icon as any} size={24} color="#00e676" />
              </View>
              <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos Destacados</Text>
          <TouchableOpacity>
            <Text style={styles.verTodosText}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {PRODUCTS.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: prod.image }} style={styles.productImage} />
                {prod.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{prod.discount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>{prod.price}</Text>
                  {prod.oldPrice && (
                    <Text style={styles.productOldPrice}>{prod.oldPrice}</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
                <Ionicons name="cart-outline" size={16} color="#0b0f19" style={{ marginRight: 6 }} />
                <Text style={styles.addToCartText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f19",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#151b2c",
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#00e676",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingVertical: 4,
  },
  headerLinkText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  headerRegisterBtn: {
    backgroundColor: "#00e676",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
  },
  headerRegisterText: {
    color: "#0b0f19",
    fontSize: 11,
    fontWeight: "700",
  },
  cartIconBtn: {
    padding: 4,
  },
  profileBtn: {
    padding: 4,
    marginRight: 8,
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    backgroundColor: "#151b2c",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#242f48",
    overflow: "hidden",
    alignItems: "center",
    height: 48,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: "#ffffff",
    fontSize: 14,
    height: "100%",
  },
  searchBtn: {
    backgroundColor: "#00e676",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  heroBanner: {
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#007a87", 
    flexDirection: "row",
    padding: 14,
    minHeight: 140,
    overflow: "hidden",
    marginBottom: 16,
  },
  heroLeft: {
    flex: 1.2,
    justifyContent: "center",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tagText: {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#e5e7eb",
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  heroBtn: {
    backgroundColor: "#fbbf24",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroBtnText: {
    color: "#0b0f19",
    fontSize: 12,
    fontWeight: "700",
  },
  heroRight: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  thankYouCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    alignItems: "center",
    transform: [{ rotate: "3deg" }],
  },
  thankYouText: {
    color: "#b91c1c",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  onlineText: {
    color: "#b91c1c",
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  verTodosText: {
    color: "#00e676",
    fontSize: 13,
    fontWeight: "600",
  },
  categoriesList: {
    paddingLeft: 12,
    paddingBottom: 8,
  },
  categoryCard: {
    backgroundColor: "#151b2c",
    borderWidth: 1,
    borderColor: "#242f48",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: 115,
    marginRight: 10,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e2640",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryCount: {
    color: "#6b7280",
    fontSize: 9,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#151b2c",
    borderWidth: 1,
    borderColor: "#242f48",
    borderRadius: 10,
    width: (width - 28) / 2, 
    marginBottom: 10,
    padding: 6,
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#1e2640",
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fbbf24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: "#0b0f19",
    fontSize: 10,
    fontWeight: "700",
  },
  productInfo: {
    marginVertical: 8,
  },
  productName: {
    color: "#ffffff",
    fontSize: 13,
    lineHeight: 16,
    height: 32, 
  },
  priceContainer: {
    marginTop: 6,
  },
  productPrice: {
    color: "#00e676",
    fontSize: 15,
    fontWeight: "700",
  },
  productOldPrice: {
    color: "#6b7280",
    fontSize: 11,
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  addToCartBtn: {
    backgroundColor: "#00e676",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  addToCartText: {
    color: "#0b0f19",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default Home;