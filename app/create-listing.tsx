import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '../src/hooks/useTranslation';
import { createListing, updateListing, fetchListingById } from '../src/services/firebase/listingService';
import { getSectorInterestsMeta } from '../src/constants/sectorInterests';

const Colors = {
  background: '#FAFAFC',
  navy: '#051930',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  primaryBtn: '#051930',
  lightGray: '#F3F4F6',
};

export default function CreateListingModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;

  const { t, isRTL } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    titleEn: '',
    descriptionEn: '',
    targetCapitalization: '',
    sector: '',
    imageUrl: null,
  });

  const ALL_SECTORS = getSectorInterestsMeta(t);

  useEffect(() => {
    if (isEditMode) {
      fetchListingById(id).then(data => {
        if (data) {
          setFormData({
            titleEn: data.titleEn || '',
            descriptionEn: data.descriptionEn || '',
            targetCapitalization: data.targetCapitalization ? data.targetCapitalization.toString() : '',
            sector: data.sector || '',
            imageUrl: data.imageUrl || null,
          });
        }
        setFetching(false);
      });
    }
  }, [id, isEditMode]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, imageUrl: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (!formData.titleEn) return;
    setLoading(true);
    
    const payload = {
      titleEn: formData.titleEn,
      titleAr: formData.titleEn, // placeholder
      descriptionEn: formData.descriptionEn,
      descriptionAr: formData.descriptionEn,
      targetCapitalization: Number(formData.targetCapitalization.replace(/,/g, '')) || 0,
      sector: formData.sector || 'Technology',
      sectorAr: formData.sector || 'تكنولوجيا',
      imageUrl: formData.imageUrl,
    };

    if (isEditMode) {
      updateListing(id, payload).then(() => {
        setLoading(false);
        router.back();
      });
    } else {
      createListing({
        ...payload,
        capitalMin: 10000,
        capitalMax: 100000,
        currency: 'JOD',
        isEcoFriendly: false,
      }).then(() => {
        setLoading(false);
        router.back();
      });
    }
  };

  const selectedSector = ALL_SECTORS.find(s => s.name === formData.sector) || ALL_SECTORS.find(s => s.id === formData.sector);

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.navy} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="x" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? t('edit') : t('newListingTitle')}</Text>
        <View style={{ width: 24 }} />{/* Balance for center title */}
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('assetDetails')}</Text>
        
        {/* Image Picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={24} color={Colors.textMuted} />
                <Text style={styles.imagePlaceholderText}>Add Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('assetName')}</Text>
          <TextInput 
            style={[styles.input, isRTL && { textAlign: 'right' }]} 
            placeholder="e.g. Al-Zarqa Industrial Hub"
            placeholderTextColor={Colors.textMuted}
            value={formData.titleEn}
            onChangeText={(t) => setFormData({...formData, titleEn: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('description')}</Text>
          <TextInput 
            style={[styles.input, styles.textArea, isRTL && { textAlign: 'right' }]} 
            placeholder="Describe the investment opportunity..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={formData.descriptionEn}
            onChangeText={(t) => setFormData({...formData, descriptionEn: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('targetCapitalJod')}</Text>
          <TextInput 
            style={[styles.input, isRTL && { textAlign: 'right' }]} 
            placeholder="e.g. 2,000,000"
            keyboardType="numeric"
            placeholderTextColor={Colors.textMuted}
            value={formData.targetCapitalization}
            onChangeText={(t) => setFormData({...formData, targetCapitalization: t})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('assetType')}</Text>
          <TouchableOpacity 
            style={[styles.selector, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.selectorText, selectedSector && { color: Colors.navy, fontWeight: '600' }]}>
              {selectedSector ? selectedSector.name : t('selectCategory')}
            </Text>
            <Feather name="chevron-down" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.submitBtnText}>{isEditMode ? t('edit') : t('createListing')}</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      {/* Asset Type Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.modalTitle}>{t('selectCategory')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={Colors.navy} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ALL_SECTORS.map((sector) => (
                <TouchableOpacity
                  key={sector.id}
                  style={[styles.modalItem, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => {
                    setFormData({ ...formData, sector: sector.name });
                    setModalVisible(false);
                  }}
                >
                  <Ionicons name={sector.icon as any} size={20} color={sector.color} />
                  <Text style={[styles.modalItemText, isRTL && { textAlign: 'right' }]}>{sector.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: Colors.navy,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  selectorText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  submitBtn: {
    backgroundColor: Colors.primaryBtn,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerBtn: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.background,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.navy,
    flex: 1,
  },
});
