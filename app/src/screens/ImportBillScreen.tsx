import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import {Bill} from '@/types';
import {createBill} from '@/store/slices/billsSlice';
import {AIService} from '@/services/aiService';
import {formatCurrency, getCategoryIcon, getCategoryColor} from '@/utils';

interface ParsedBill extends Omit<Bill, 'id' | 'userId' | 'synced'> {
  selected: boolean;
}

const ImportBillScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [parsedBills, setParsedBills] = useState<ParsedBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFileImport = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf, DocumentPicker.types.plainText],
        allowMultiSelection: false,
      });

      if (result && result[0]) {
        setLoading(true);
        const file = result[0];
        
        try {
          const parseResult = await AIService.parseFileContent(file);
          
          if (parseResult.success && parseResult.data) {
            const bills = Array.isArray(parseResult.data) ? parseResult.data : [parseResult.data];
            const billsWithSelection = bills.map(bill => ({
              ...bill,
              selected: true,
              time: bill.time || new Date().toISOString(),
            }));
            setParsedBills(billsWithSelection);
            Alert.alert('成功', `识别到 ${bills.length} 条账单记录`);
          } else {
            Alert.alert('提示', '未能从文件中识别出账单信息');
          }
        } catch (error) {
          Alert.alert('错误', '文件解析失败，请检查文件格式');
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('错误', '文件选择失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleBillSelection = (index: number) => {
    setParsedBills(prev => 
      prev.map((bill, i) => 
        i === index ? {...bill, selected: !bill.selected} : bill
      )
    );
  };

  const selectAll = () => {
    setParsedBills(prev => prev.map(bill => ({...bill, selected: true})));
  };

  const deselectAll = () => {
    setParsedBills(prev => prev.map(bill => ({...bill, selected: false})));
  };

  const handleImport = async () => {
    const selectedBills = parsedBills.filter(bill => bill.selected);
    
    if (selectedBills.length === 0) {
      Alert.alert('提示', '请至少选择一条账单记录');
      return;
    }

    setImporting(true);
    try {
      for (const bill of selectedBills) {
        const {selected, ...billData} = bill;
        await dispatch(createBill(billData) as any);
      }
      
      Alert.alert('成功', `已导入 ${selectedBills.length} 条账单记录`, [
        {text: '确定', onPress: () => navigation.goBack()}
      ]);
    } catch (error) {
      Alert.alert('错误', '导入失败，请重试');
    } finally {
      setImporting(false);
    }
  };

  const BillItem = ({item, index}: {item: ParsedBill; index: number}) => (
    <TouchableOpacity
      style={[styles.billItem, item.selected && styles.billItemSelected]}
      onPress={() => toggleBillSelection(index)}>
      <View style={styles.billItemContent}>
        <View style={styles.billItemLeft}>
          <View
            style={[
              styles.categoryIcon,
              {backgroundColor: getCategoryColor(item.category)},
            ]}>
            <Icon
              name={getCategoryIcon(item.category)}
              size={16}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.billInfo}>
            <Text style={styles.merchantName}>{item.merchant}</Text>
            <Text style={styles.categoryName}>{item.category}</Text>
            {item.description && (
              <Text style={styles.description} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.billItemRight}>
          <Text
            style={[
              styles.amount,
              item.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={styles.time}>
            {new Date(item.time).toLocaleDateString('zh-CN')}
          </Text>
        </View>
      </View>
      
      <View style={styles.checkbox}>
        {item.selected && (
          <Icon name="check" size={16} color="#007AFF" />
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="file-text" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>暂无账单数据</Text>
      <Text style={styles.emptyDescription}>
        选择文件导入账单，支持图片、PDF和文本文件
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>导入账单</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.importSection}>
          <TouchableOpacity
            style={[styles.importButton, loading && styles.importButtonDisabled]}
            onPress={handleFileImport}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="upload" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.importButtonText}>
              {loading ? '解析中...' : '选择文件导入'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.supportedFormats}>
            支持格式：图片、PDF、文本文件
          </Text>
        </View>

        {parsedBills.length > 0 && (
          <View style={styles.billsSection}>
            <View style={styles.billsHeader}>
              <Text style={styles.billsTitle}>
                识别结果 ({parsedBills.filter(b => b.selected).length}/{parsedBills.length})
              </Text>
              <View style={styles.selectionButtons}>
                <TouchableOpacity
                  style={styles.selectionButton}
                  onPress={selectAll}>
                  <Text style={styles.selectionButtonText}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectionButton}
                  onPress={deselectAll}>
                  <Text style={styles.selectionButtonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <FlatList
              data={parsedBills}
              renderItem={({item, index}) => <BillItem item={item} index={index} />}
              keyExtractor={(_, index) => index.toString()}
              style={styles.billsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {parsedBills.length === 0 && !loading && <EmptyState />}
      </View>

      {parsedBills.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.importConfirmButton,
              (importing || parsedBills.filter(b => b.selected).length === 0) &&
                styles.importConfirmButtonDisabled,
            ]}
            onPress={handleImport}
            disabled={importing || parsedBills.filter(b => b.selected).length === 0}>
            {importing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.importConfirmButtonText}>
                导入选中账单 ({parsedBills.filter(b => b.selected).length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  importSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  importButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  supportedFormats: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  billsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  billsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  billsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectionButtons: {
    flexDirection: 'row',
  },
  selectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  selectionButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  billsList: {
    flex: 1,
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  billItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  billItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  billItemRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  incomeAmount: {
    color: '#34C759',
  },
  expenseAmount: {
    color: '#FF3B30',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  importConfirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  importConfirmButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  importConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ImportBillScreen;