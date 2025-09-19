import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { api } from '@/services/api';
import { PriceCard } from '@/components/PriceCard';
import { PriceData } from '@/types/api';

export default function DashboardScreen() {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.getPrices();
      
      if (response.status === 'success' || response.data) {
        setPrices(response.data);
      } else {
        throw new Error('Failed to fetch prices');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch current prices. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupAutoRefresh = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for 10 minutes (600000 ms)
    intervalRef.current = setInterval(() => {
      fetchPrices();
    }, 600000);
  };

  useEffect(() => {
    fetchPrices();
    setupAutoRefresh();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            router.replace('/(tabs)/login');
          },
        },
      ],
    );
  };

  const onRefresh = () => {
    fetchPrices(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require('../../assets/images/icon.png')} style={styles.headerLogo} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>SMJ</Text>
            <Text style={styles.headerSubtitle}>Today's Gold & Silver Prices</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.pricesContainer}>
          <Text style={styles.sectionTitle}>Current Market Prices</Text>
          
          <PriceCard
            title="1 Gram Gold Price"
            price={prices.gold_1g || ''}
            loading={loading}
          />
          
          <PriceCard
            title="8 Gram Gold Price"
            price={prices.gold_8g || ''}
            loading={loading}
          />
          
          <PriceCard
            title="1 Gram Silver Price"
            price={prices.silver_1g || ''}
            loading={loading}
          />

          {prices.date && (
            <Text style={styles.lastUpdated}>
              Last Updated: {new Date(prices.date).toLocaleString()}
            </Text>
          )}
        </View>

        <View style={styles.refreshInfo}>
          <Text style={styles.refreshText}>
            Prices automatically refresh every 10 minutes
          </Text>
          <Text style={styles.refreshText}>
            Pull down to refresh manually
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: Colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  pricesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  lastUpdated: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    fontStyle: 'italic',
  },
  refreshInfo: {
    padding: 20,
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 2,
  },
});