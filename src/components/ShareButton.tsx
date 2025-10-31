import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Hymn, Verse } from '../types/vedic';

interface ShareButtonProps {
  hymn?: Hymn;
  verse?: Verse;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ hymn, verse, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    if (verse && hymn) {
      const translation = verse.translations.wilson || 
                         verse.translations.griffith || 
                         verse.translations.jamison || '';
      return `${hymn.id} - ${hymn.devata}\n\n"${translation}"\n\n— Rig Veda Explorer`;
    } else if (hymn) {
      return `Explore ${hymn.id} - ${hymn.devata} on Rig Veda Explorer`;
    }
    return 'Explore the Rig Veda on Rig Veda Explorer';
  };

  const getShareUrl = () => {
    if (hymn) {
      return `${window.location.origin}/hymn/${hymn.id}`;
    }
    return window.location.origin;
  };

  const copyToClipboard = async () => {
    try {
      const text = `${getShareText()}\n${getShareUrl()}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: hymn ? `${hymn.id} - ${hymn.devata}` : 'Rig Veda Explorer',
          text: getShareText(),
          url: getShareUrl(),
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setIsOpen(false);
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setIsOpen(false);
  };

  const shareOptions = [
    {
      icon: Share2,
      label: typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function' ? 'Share' : 'Copy Link',
      action: shareNative,
      color: 'text-blue-400'
    },
    {
      icon: Copy,
      label: 'Copy Text',
      action: copyToClipboard,
      color: 'text-green-400'
    },
    {
      icon: Link2,
      label: 'Copy URL',
      action: async () => {
        try {
          await navigator.clipboard.writeText(getShareUrl());
          toast.success('URL copied!');
          setIsOpen(false);
        } catch (err) {
          toast.error('Failed to copy URL');
        }
      },
      color: 'text-purple-400'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      action: shareTwitter,
      color: 'text-blue-300'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      action: shareFacebook,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-vedic-gold/20 hover:bg-vedic-gold/30 border border-vedic-gold/40 hover:border-vedic-gold/60 rounded-lg transition-all duration-300 hover:scale-105"
        aria-label="Share"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Share2 className="h-4 w-4 text-vedic-gold" />
        )}
        <span className="text-sm font-medium text-vedic-gold">Share</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full mb-2 right-0 z-50 card border-2 border-vedic-gold/40 min-w-[200px]"
            >
              <div className="space-y-1">
                {shareOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={index}
                      onClick={option.action}
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-vedic-gold/10 transition-colors group text-left"
                    >
                      <Icon className={`h-4 w-4 ${option.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm text-vedic-light group-hover:text-vedic-gold transition-colors">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;

