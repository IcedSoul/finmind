import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useCategoriesStore } from '@/store/categoriesStore';
import { useBillsStore } from '@/store/billsStore';
import { LinearGradient } from 'expo-linear-gradient';

const AddBillScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { categories, loading, fetchCategories } = useCategoriesStore();
  const { addBill } = useBillsStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState<'date' | 'time'>('date');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    return new Intl.NumberFormat('zh-CN').format(parseInt(numericValue));
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDateTimeChange = (event: any, selectedDateTime?: Date) => {
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      setShowDateTimePicker(false);
      return;
    }

    if (selectedDateTime) {
      if (dateTimePickerMode === 'date') {
        setSelectedDate(selectedDateTime);
        if (Platform.OS === 'android') {
          setShowDateTimePicker(false);
          setTimeout(() => {
            setDateTimePickerMode('time');
            setShowDateTimePicker(true);
          }, 100);
        } else {
          setDateTimePickerMode('time');
        }
      } else {
        setSelectedTime(selectedDateTime);
        setShowDateTimePicker(false);
        setDateTimePickerMode('date');
      }
    } else {
      setShowDateTimePicker(false);
      setDateTimePickerMode('date');
    }
  };

  const handleDateTimePress = () => {
    setDateTimePickerMode('date');
    setShowDateTimePicker(true);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert(t('common.error'), t('addBill.required'));
      return;
    }

    if (parseInt(amount) <= 0) {
      Alert.alert(t('common.error'), t('addBill.invalidAmount'));
      return;
    }

    const billData = {
      amount: parseInt(amount),
      description,
      type: selectedType,
      category: selectedCategory,
      date: selectedDate,
      time: selectedTime,
      tags,
    };

    try {
      await addBill(billData);
      Alert.alert(t('common.success'), t('addBill.success'), [
        {
          text: t('common.ok'),
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(t('common.error'), t('addBill.error'));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(time);
  };

  const filteredCategories = categories.filter(cat => cat.type === selectedType);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6C5CE7', '#A29BFE']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addBill.title')}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>{t('addBill.save')}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'expense' && styles.typeButtonActive,
                { backgroundColor: selectedType === 'expense' ? '#E17055' : '#F8F9FA' },
              ]}
              onPress={() => {
                setSelectedType('expense');
                setSelectedCategory('');
              }}
            >
              <Icon
                name="minus"
                size={18}
                color={selectedType === 'expense' ? '#FFFFFF' : '#636E72'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  { color: selectedType === 'expense' ? '#FFFFFF' : '#636E72' },
                ]}
              >
                {t('addBill.expense')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'income' && styles.typeButtonActive,
                { backgroundColor: selectedType === 'income' ? '#00B894' : '#F8F9FA' },
              ]}
              onPress={() => {
                setSelectedType('income');
                setSelectedCategory('');
              }}
            >
              <Icon
                name="plus"
                size={18}
                color={selectedType === 'income' ? '#FFFFFF' : '#636E72'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  { color: selectedType === 'income' ? '#FFFFFF' : '#636E72' },
                ]}
              >
                {t('addBill.income')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>{t('addBill.amount')}</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountInput}
                value={formatCurrency(amount)}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor="#636E72"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
          </View>

          <View style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>{t('addBill.category')}</Text>
            {loading ? (
              <Text style={styles.loadingText}>Loading categories...</Text>
            ) : (
              <View style={styles.categoryGrid}>
                {filteredCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category.id && {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor:
                            selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#F8F9FA',
                        },
                      ]}
                    >
                      <Icon
                        name={category.icon}
                        size={18}
                        color={selectedCategory === category.id ? '#FFFFFF' : category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          color: selectedCategory === category.id ? '#FFFFFF' : '#2D3436',
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>{t('addBill.details')}</Text>
            
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder={t('addBill.descriptionPlaceholder')}
                placeholderTextColor="#636E72"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity style={styles.dateTimeInput} onPress={handleDateTimePress}>
                <Icon name="calendar" size={18} color="#6C5CE7" />
                <Text style={styles.dateTimeValue}>
                  {formatDate(selectedDate)} {formatTime(selectedTime)}
                </Text>
                <Icon name="chevron-down" size={14} color="#636E72" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>{t('addBill.tags')}</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                      <Icon name="x" size={12} color="#636E72" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => setShowTagInput(true)}
                >
                  <Icon name="plus" size={14} color="#6C5CE7" />
                  <Text style={styles.addTagText}>{t('addBill.addTag')}</Text>
                </TouchableOpacity>
              </View>
              
              {showTagInput && (
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder={t('addBill.enterTag')}
                    placeholderTextColor="#636E72"
                    autoFocus
                  />
                  <TouchableOpacity style={styles.tagConfirmButton} onPress={handleAddTag}>
                    <Icon name="check" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tagCancelButton}
                    onPress={() => {
                      setShowTagInput(false);
                      setNewTag('');
                    }}
                  >
                    <Icon name="x" size={14} color="#636E72" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>



        {showDateTimePicker && (
          <DateTimePicker
            value={dateTimePickerMode === 'date' ? selectedDate : selectedTime}
            mode={dateTimePickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateTimeChange}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 16 : 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    minWidth: 100,
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    height: 40,
    lineHeight: Platform.OS === 'android' ? 40 : undefined,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        paddingVertical: 0,
        marginTop: 4,
      },
    }),
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    paddingVertical: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#2D3436',
    textAlignVertical: 'top',
    includeFontPadding: false,
    minHeight: 60,
  },
  dateTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 12,
  },
  dateTimeValue: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    fontWeight: '500',
    marginLeft: 10,
    marginRight: 8,
  },
  tagsSection: {
    marginTop: 4,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '500',
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addTagText: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '500',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#2D3436',
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    height: 36,
    lineHeight: Platform.OS === 'android' ? 36 : undefined,
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        paddingVertical: 0,
        marginTop: 3,
      },
      ios: {
        paddingVertical: 8,
      },
    }),
  },
  tagConfirmButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 6,
    padding: 6,
  },
  tagCancelButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    marginLeft: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default AddBillScreen;
