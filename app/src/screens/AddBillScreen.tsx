import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useForm, useCategories } from '@/hooks';
import { validateAmount, getCategoryIcon, getCategoryColor } from '@/utils';
import { aiService } from '@/services/aiService';
import { Bill } from '@/types';
import { useBillsStore } from '@/store/billsStore';

type BillType = 'income' | 'expense';

interface TypeButtonProps {
  type: BillType;
  title: string;
  billType: BillType;
  setBillType: (type: BillType) => void;
}

interface CategoryItemProps {
  category: string;
  setValue: (
    name: 'merchant' | 'amount' | 'category' | 'description' | 'time',
    value: string,
  ) => void;
  setShowCategoryModal: (show: boolean) => void;
}

interface AIModalProps {
  showAIModal: boolean;
  setShowAIModal: (show: boolean) => void;
  aiProcessing: boolean;
  handleAIRecognition: (text: string) => void;
}

const TypeButton: React.FC<TypeButtonProps> = ({
  type,
  title,
  billType,
  setBillType,
}) => (
  <TouchableOpacity
    style={[
      styles.typeButton,
      billType === type && styles.typeButtonActive,
      billType === type && type === 'income' && styles.incomeButtonActive,
      billType === type && type === 'expense' && styles.expenseButtonActive,
    ]}
    onPress={() => setBillType(type)}
  >
    <Text
      style={[
        styles.typeButtonText,
        billType === type && styles.typeButtonTextActive,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  setValue,
  setShowCategoryModal,
}) => (
  <TouchableOpacity
    style={styles.categoryItem}
    onPress={() => {
      setValue('category', category);
      setShowCategoryModal(false);
    }}
  >
    <View
      style={[
        styles.categoryIcon,
        { backgroundColor: getCategoryColor(category) },
      ]}
    >
      <Icon name={getCategoryIcon(category) as any} size={20} color="#FFFFFF" />
    </View>
    <Text style={styles.categoryName}>{category}</Text>
  </TouchableOpacity>
);

const AIModal: React.FC<AIModalProps> = ({
  showAIModal,
  setShowAIModal,
  aiProcessing,
  handleAIRecognition,
}) => {
  const [aiText, setAiText] = useState('');

  return (
    <Modal
      visible={showAIModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAIModal(false)}
    >
      <View style={styles.aiModalContainer}>
        <View style={styles.aiModalHeader}>
          <TouchableOpacity onPress={() => setShowAIModal(false)}>
            <Icon name={'x' as any} size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.aiModalTitle}>AI智能识别</Text>
          <View style={styles.placeholderView} />
        </View>

        <View style={styles.aiModalContent}>
          <Text style={styles.aiModalDescription}>
            输入账单相关文本，AI将自动识别商户、金额、分类等信息
          </Text>

          <TextInput
            style={styles.aiTextInput}
            placeholder="例如：在星巴克消费了35元买咖啡"
            value={aiText}
            onChangeText={setAiText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.aiRecognizeButton,
              (!aiText.trim() || aiProcessing) &&
                styles.aiRecognizeButtonDisabled,
            ]}
            onPress={() => handleAIRecognition(aiText)}
            disabled={!aiText.trim() || aiProcessing}
          >
            <Text style={styles.aiRecognizeButtonText}>
              {aiProcessing ? '识别中...' : '开始识别'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AddBillScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { createBill, updateBill, loading } = useBillsStore();
  const { categories } = useCategories();

  const editingBill = (route.params as any)?.bill as Bill | undefined;
  const aiData = (route.params as any)?.aiData;
  const isEditing = !!editingBill;

  const [billType, setBillType] = useState<BillType>(
    editingBill?.type || 'expense',
  );
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const { values, errors, handleChange } = useForm({
    merchant: editingBill?.merchant || '',
    amount: editingBill?.amount?.toString() || '',
    category: editingBill?.category || '',
    description: editingBill?.description || '',
    time: editingBill?.time || new Date().toISOString(),
  });

  const setValue = useCallback(
    (
      name: 'merchant' | 'amount' | 'category' | 'description' | 'time',
      value: string,
    ) => {
      handleChange(name, value);
    },
    [handleChange],
  );

  const handleSubmit = async () => {
    if (!values.merchant.trim()) {
      Alert.alert('错误', '请输入商户名称');
      return;
    }
    if (!values.amount.trim()) {
      Alert.alert('错误', '请输入金额');
      return;
    }
    if (!validateAmount(values.amount)) {
      Alert.alert('错误', '请输入有效金额');
      return;
    }
    if (!values.category.trim()) {
      Alert.alert('错误', '请选择分类');
      return;
    }

    try {
      const billData = {
        merchant: values.merchant,
        amount: parseFloat(values.amount),
        category: values.category,
        description: values.description,
        type: billType,
        time: values.time,
      };

      if (isEditing && editingBill) {
        await updateBill(editingBill.id, billData);
        Alert.alert('成功', '账单已更新');
      } else {
        await createBill(billData);
        Alert.alert('成功', '账单已添加');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        '错误',
        error.message || (isEditing ? '更新账单失败' : '添加账单失败'),
      );
    }
  };

  useEffect(() => {
    if (aiData) {
      setValue('merchant', aiData.merchant || '');
      setValue('amount', aiData.amount?.toString() || '');
      setValue('category', aiData.category || '');
      setValue('description', aiData.description || '');
      if (aiData.type) {
        setBillType(aiData.type);
      }
    }
  }, [aiData, setValue]);

  const handleAIRecognition = async (text: string) => {
    setAiProcessing(true);
    try {
      const result = await aiService.parseTextContent(text);
      if (result.success && result.data && result.data.length > 0) {
        const firstBill = result.data[0];
        setValue('merchant', firstBill.merchant || '');
        setValue('amount', firstBill.amount?.toString() || '');
        setValue('category', firstBill.category || '');
        setValue('description', '');
        if (firstBill.type) {
          setBillType(firstBill.type);
        }
        Alert.alert('成功', 'AI识别完成');
      } else {
        Alert.alert('提示', '未能识别出有效信息');
      }
    } catch (error) {
      Alert.alert('错误', 'AI识别失败');
    } finally {
      setAiProcessing(false);
      setShowAIModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-left' as any} size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? '编辑账单' : '添加账单'}
        </Text>
        <TouchableOpacity onPress={() => setShowAIModal(true)}>
          <Icon name={'zap' as any} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.typeSelector}>
          <TypeButton
            type="expense"
            title="支出"
            billType={billType}
            setBillType={setBillType}
          />
          <TypeButton
            type="income"
            title="收入"
            billType={billType}
            setBillType={setBillType}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>商户名称</Text>
            <TextInput
              style={[styles.input, errors.merchant && styles.inputError]}
              placeholder="请输入商户名称"
              value={values.merchant}
              onChangeText={text => handleChange('merchant', text)}
            />
            {errors.merchant && (
              <Text style={styles.errorText}>{errors.merchant}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>金额</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={[styles.amountInput, errors.amount && styles.inputError]}
                placeholder="0.00"
                value={values.amount}
                onChangeText={text => handleChange('amount', text)}
                keyboardType="numeric"
              />
            </View>
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>分类</Text>
            <TouchableOpacity
              style={[
                styles.categorySelector,
                errors.category && styles.inputError,
              ]}
              onPress={() => setShowCategoryModal(true)}
            >
              {values.category ? (
                <View style={styles.selectedCategory}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: getCategoryColor(values.category) },
                    ]}
                  >
                    <Icon
                      name={getCategoryIcon(values.category)}
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.selectedCategoryText}>
                    {values.category}
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>请选择分类</Text>
              )}
              <Icon name="chevron-right" size={16} color="#C7C7CC" />
            </TouchableOpacity>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>备注（可选）</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="添加备注信息"
              value={values.description}
              onChangeText={text => handleChange('description', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>时间</Text>
            <TouchableOpacity style={styles.timeSelector}>
              <Text style={styles.timeText}>
                {new Date(values.time).toLocaleString('zh-CN')}
              </Text>
              <Icon name="calendar" size={16} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? '保存中...' : isEditing ? '更新账单' : '添加账单'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.categoryModalContainer}>
          <View style={styles.categoryModalHeader}>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Icon name="x" size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={styles.categoryModalTitle}>选择分类</Text>
            <View style={styles.placeholderView} />
          </View>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryItem
                category={item.name}
                setValue={setValue}
                setShowCategoryModal={setShowCategoryModal}
              />
            )}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={styles.categoryList}
          />
        </View>
      </Modal>

      <AIModal
        showAIModal={showAIModal}
        setShowAIModal={setShowAIModal}
        aiProcessing={aiProcessing}
        handleAIRecognition={handleAIRecognition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  incomeButtonActive: {
    backgroundColor: '#34C759',
  },
  expenseButtonActive: {
    backgroundColor: '#FF3B30',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    paddingLeft: 16,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    borderWidth: 0,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  timeText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryModalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryList: {
    padding: 20,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  aiModalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  aiModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  aiModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  placeholderView: {
    width: 24,
  },
  aiModalContent: {
    padding: 20,
  },
  aiModalDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 20,
  },
  aiTextInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  aiRecognizeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aiRecognizeButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  aiRecognizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddBillScreen;
