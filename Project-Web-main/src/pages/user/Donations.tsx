import { useEffect, useState } from 'react';
import { Heart, CreditCard, CheckCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { donationsAPI } from '../../utils/api';

const PAYMENT_METHODS = [
  { id: 'BCA', name: 'BCA', type: 'bank' },
  { id: 'BNI', name: 'BNI', type: 'bank' },
  { id: 'BRI', name: 'BRI', type: 'bank' },
  { id: 'Mandiri', name: 'Mandiri', type: 'bank' },
  { id: 'Dana', name: 'Dana', type: 'ewallet' },
  { id: 'OVO', name: 'OVO', type: 'ewallet' },
  { id: 'GoPay', name: 'GoPay', type: 'ewallet' },
  { id: 'QRIS', name: 'QRIS', type: 'qris' },
];

const DONATION_AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

export default function UserDonations() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donating, setDonating] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDonations(); }, []);

  const loadDonations = async () => {
    try {
      const data = await donationsAPI.getMyDonations();
      setDonations(data);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonating(true);
    setError('');
    setSuccess(null);

    const donationAmount = amount || parseInt(customAmount);

    if (!donationAmount || donationAmount < 1000) {
      setError('Please enter a valid donation amount (minimum 1,000 IDR)');
      setDonating(false);
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      setDonating(false);
      return;
    }

    try {
      const result = await donationsAPI.create({ amount: donationAmount, payment_method: paymentMethod });
      setSuccess(result);
      await refreshUser();
      await loadDonations();
      setAmount(null);
      setCustomAmount('');
      setPaymentMethod('');
    } catch (err: any) {
      setError(err.message || 'Donation failed');
    } finally {
      setDonating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Make a Donation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="font-display text-xl font-bold text-gray-900">Donation Amount</h2>
            </div>

            {success && (
              <div className="mb-6 p-6 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Donation Successful!</h3>
                    <p className="text-green-700 text-sm">Thank you for your generous contribution</p>
                  </div>
                </div>
                <div className="text-sm text-green-700">
                  <p>Amount: {formatCurrency(success.donation.amount)}</p>
                  <p>Method: {success.donation.payment_method}</p>
                  {success.newBadge && <p className="font-semibold mt-2">Congratulations! You earned the {success.newBadge} badge!</p>}
                </div>
              </div>
            )}

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleDonation}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {DONATION_AMOUNTS.map((amt) => (
                  <button key={amt} type="button"
                    onClick={() => { setAmount(amt); setCustomAmount(''); }}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${amount === amt ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input type="number" value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
                    min="1000"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="Enter amount" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button key={method.id} type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${paymentMethod === method.id ? 'border-forest-600 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={donating}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-forest-600 text-white font-semibold rounded-lg hover:bg-forest-700 disabled:opacity-50">
                <Heart className="w-5 h-5" />
                {donating ? 'Processing...' : `Donate ${formatCurrency(amount || parseInt(customAmount) || 0)}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">This is a simulation. No actual payment will be processed.</p>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-6 h-6 text-forest-600" />
              <h2 className="font-display text-xl font-bold text-gray-900">Donation History</h2>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading your donations...</p>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No donations yet</p>
                <p className="text-sm text-gray-400">Make your first donation above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(donation.amount)}</p>
                      <p className="text-sm text-gray-500">{donation.payment_method} - {formatDate(donation.donated_at)}</p>
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Success
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
