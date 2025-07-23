import React from 'react';
import { useState, useEffect } from 'react';
import OfflineSMSHandler from '../components/OfflineSMSHandler';
import RoutePlanner from '../components/RoutePlanner';
import SafetyCircle from '../components/SafetyCircle';
import VehicleScanner from '../components/VehicleScanner';
import VoiceDistressDetector from '../components/VoiceDistressDetector';
import VoiceSOS from '../components/VoiceSOS';
import { Shield, MapPin, Users, Camera, Mic, Phone, Route, Wifi, AlertTriangle, Activity, BarChart3, Clock, Zap, Star, TrendingUp, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

function Dashboard() {
  const [trustedContactsCount, setTrustedContactsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch trusted contacts count from backend
  useEffect(() => {
    const fetchTrustedContacts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/api/trusted-contacts/count`);
        const data = await response.json();
        setTrustedContactsCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching trusted contacts:', error);
        setTrustedContactsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustedContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-semibold">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Protection Status</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">Active</p>
                <p className="text-xs text-gray-500">24/7 Monitoring</p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-semibold">Optimal</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Response Time</p>
                <p className="text-3xl font-bold text-gray-900 mb-1"> 2.5s</p>
                <p className="text-xs text-gray-500">Average Response</p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600 font-semibold">5.0</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Trusted Contacts</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : trustedContactsCount}
                </p>
                <p className="text-xs text-gray-500">Emergency Network</p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-semibold">Live</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Last Check-in</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">1m</p>
                <p className="text-xs text-gray-500">Auto-updated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Controls - Premium Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Emergency SOS */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <AlertTriangle className="h-8 w-8 animate-pulse" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold">Emergency SOS</h3>
                      <p className="text-red-100 text-sm">Critical Alert System</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-xs font-semibold">PRIORITY</span>
                  </div>
                </div>
                <p className="text-white/90 mb-6 text-lg">Instant emergency alert to your trusted contacts with location data</p>
                <VoiceSOS />
              </div>
            </div>
          </div>

          {/* Voice Distress Detection */}
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Voice Monitor</h3>
                    <p className="text-gray-600 text-sm">AI-Powered Detection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full border border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-700 font-semibold">LISTENING</span>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Advanced AI algorithms detect distress patterns in voice and ambient sounds</p>
              <VoiceDistressDetector />
            </div>
          </div>

          {/* Connection Status */}
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Wifi className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Connection Hub</h3>
                    <p className="text-gray-600 text-sm">Network & Offline Ready</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700 font-semibold">ONLINE</span>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Seamless connectivity with offline backup capabilities for critical situations</p>
              <OfflineSMSHandler />
            </div>
          </div>
        </div>

        {/* Main Features - Enhanced Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12">
          
          {/* Route Planner */}
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-8 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Route className="h-10 w-10" />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-3xl font-bold">Safe Route Planner</h3>
                      <p className="text-indigo-100 text-lg">AI-powered safety scoring with real-time updates</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <p className="text-sm font-semibold">Safety Score</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <RoutePlanner />
              </div>
            </div>
          </div>

          {/* Vehicle Scanner */}
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Camera className="h-10 w-10" />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-3xl font-bold">Vehicle Scanner</h3>
                      <p className="text-emerald-100 text-lg">Smart recognition & verification system</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <p className="text-sm font-semibold">Accuracy</p>
                      <p className="text-2xl font-bold">99.2%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <VehicleScanner />
              </div>
            </div>
          </div>
        </div>

        {/* Safety Circle - Premium Design */}
        <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-8 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Users className="h-10 w-10" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold">Safety Circle Management</h3>
                    <p className="text-pink-100 text-lg">Manage your trusted emergency contacts and permissions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-semibold">Active Contacts</p>
                    <p className="text-2xl font-bold">
                      {loading ? '...' : `${trustedContactsCount}/10`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-0">
              <SafetyCircle />
            </div>
          </div>
        </div>

        {/* Enhanced System Information */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">System Performance</h3>
                <p className="text-gray-300">Real-time monitoring and analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs text-gray-300">All Systems</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-600 font-medium">System Uptime</div>
                <div className="text-xs text-green-600 font-semibold mt-1">Excellent</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Active Monitoring</div>
                <div className="text-xs text-blue-600 font-semibold mt-1">Continuous</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">256-bit</div>
                <div className="text-sm text-gray-600 font-medium">Encryption</div>
                <div className="text-xs text-purple-600 font-semibold mt-1">Military Grade</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2"> 2s</div>
                <div className="text-sm text-gray-600 font-medium">Response Time</div>
                <div className="text-xs text-orange-600 font-semibold mt-1">Lightning Fast</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;