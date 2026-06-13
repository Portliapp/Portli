import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export const supabaseService = {
  // === AUTHENTICATION ===
  
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          tier: 'Piano Standard',
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // === TRANSACTIONS (CRUD) ===

  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Convert database row back to frontend Transaction object
    return (data || []).map(row => ({
      id: row.id,
      ticker: row.ticker,
      name: row.name,
      assetType: row.assetType as any,
      quantity: Number(row.quantity),
      price: Number(row.price),
      date: row.date,
      type: row.type as any
    }));
  },

  async addTransaction(tx: Omit<Transaction, 'id'>, userId: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        ticker: tx.ticker,
        name: tx.name,
        assetType: tx.assetType,
        quantity: tx.quantity,
        price: tx.price,
        date: tx.date,
        type: tx.type
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      ticker: data.ticker,
      name: data.name,
      assetType: data.assetType as any,
      quantity: Number(data.quantity),
      price: Number(data.price),
      date: data.date,
      type: data.type as any
    };
  },

  async deleteTransaction(txId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', txId);

    if (error) throw error;
  }
};
