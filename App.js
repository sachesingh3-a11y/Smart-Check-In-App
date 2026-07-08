import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Linking, 
  ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@checkin_data';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedData();
    requestAllPermissions(); // Meminta semua izin saat aplikasi pertama kali dibuka
  }, []);

  // FUNGSI BARU: Meminta semua izin di awal
  const requestAllPermissions = async () => {
    try {
      // 1. Izin Kamera
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        await ImagePicker.requestCameraPermissionsAsync();
      }

      // 2. Izin Galeri
      const libraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (libraryStatus.status !== 'granted') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      // 3. Izin Lokasi
      const locationStatus = await Location.getForegroundPermissionsAsync();
      if (locationStatus.status !== 'granted') {
        await Location.requestForegroundPermissionsAsync();
      }
    } catch (error) {
      console.log('Gagal meminta izin di awal:', error);
    }
  };

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.imageUri) setImageUri(parsedData.imageUri);
        if (parsedData.location) setLocation(parsedData.location);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data lokal.');
    }
  };

  const saveData = async (uri, loc) => {
    try {
      const dataToSave = { imageUri: uri, location: loc };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak', 
        'Aplikasi membutuhkan akses kamera untuk mengambil foto profil.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setImageUri(newUri);
      saveData(newUri, location);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak', 
        'Aplikasi membutuhkan akses galeri untuk memilih foto.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setImageUri(newUri);
      saveData(newUri, location);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setLoading(false);
      Alert.alert(
        'Izin Ditolak', 
        'Aplikasi membutuhkan izin lokasi untuk melakukan check-in.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(coords);
      saveData(imageUri, coords);
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (!location) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Tidak dapat membuka Google Maps.');
    });
  };

  const resetData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setImageUri(null);
      setLocation(null);
      Alert.alert('Sukses', 'Data check-in berhasil direset.');
    } catch (error) {
      Alert.alert('Error', 'Gagal mereset data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SMART CHECK-IN</Text>
      
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderContainer]}>
              <Text style={styles.placeholderText}>No Photo</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>Sache Deep Singh</Text>
        <Text style={styles.nim}>NIM: 243303621202</Text>
        <Text style={styles.prodi}>Sistem Informasi</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Status Lokasi:</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#D4AF37" style={{ marginVertical: 10 }} />
        ) : location ? (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>Lat: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Lng: {location.longitude.toFixed(6)}</Text>
          </View>
        ) : (
          <Text style={styles.noLocationText}>Belum check-in lokasi.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Ambil Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
        <Text style={styles.buttonText}>🖼️ Pilih dari Galeri</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>📍 Ambil Lokasi GPS</Text>
      </TouchableOpacity>

      {location && (
        <TouchableOpacity style={[styles.button, styles.mapsButton]} onPress={openInMaps}>
          <Text style={styles.buttonText}>🗺️ Lihat di Google Maps</Text>
        </TouchableOpacity>
      )}

      {(imageUri || location) && (
        <TouchableOpacity style={styles.resetButton} onPress={resetData}>
          <Text style={styles.resetButtonText}>Reset Data</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A0E17',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 25,
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    backgroundColor: '#161F30',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#233047',
  },
  imageContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  placeholderContainer: {
    backgroundColor: '#233047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8E9AA8',
    fontSize: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  nim: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 4,
  },
  prodi: {
    fontSize: 14,
    color: '#D4AF37',
    fontStyle: 'italic',
    marginTop: 2,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#233047',
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#8E9AA8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    backgroundColor: '#1F2E46',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  noLocationText: {
    color: '#E53E3E',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#1F2E46',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#314663',
  },
  mapsButton: {
    backgroundColor: '#2B5C3F',
    borderColor: '#387A54',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '500',
  },
});