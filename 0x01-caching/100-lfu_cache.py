#!/usr/bin/env python3
""" 100-lfu_cache module """

from collections import OrderedDict

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFUCache inherits from BaseCaching and implements an LFU caching system
    with a tiebreaker for LRU (Least Recently Used) when discarding items.
    """

    def __init__(self):
        """
        Initialize the parent class and
        set MAX_ITEMS based on BaseCaching.MAX_ITEMS.
        Use a dictionary to store key-value pairs (cache_data).
        Use another dictionary to track access counts for each key (counts).
        Use a third ordered dictionary to track the least recently used items
        within each frequency count (uses_by_count).
        """
        super().__init__()
        self.cache_data = OrderedDict()
        self.keys_freq = []

    def __reorder_items(self, mru_key):
        """
        Reorders the items in the cache based on the most recently used item.
        Args:
            mru_key: The key of the most recently used item.
        """
        max_positions = []
        mru_freq = 0
        mru_pos = 0
        ins_pos = 0
        for i, key_freq in enumerate(self.keys_freq):
            if key_freq[0] == mru_key:
                mru_freq = key_freq[1] + 1
                mru_pos = i
                break
            elif not max_positions:
                max_positions.append(i)
            elif key_freq[1] < self.keys_freq[max_positions[-1]][1]:
                max_positions.append(i)
        max_positions.reverse()
        for pos in max_positions:
            if self.keys_freq[pos][1] > mru_freq:
                break
            ins_pos = pos
        self.keys_freq.pop(mru_pos)
        self.keys_freq.insert(ins_pos, [mru_key, mru_freq])

    def put(self, key, item):
        """
        Add an item to the cache,
        following the LFU strategy with LRU tiebreaker.
        - If key or item is None, do nothing.
        - Otherwise, update the cache_data and keys_freq list.
        - If the cache reaches its maximum size,
        discard the least frequently used item (LFU).
        - If multiple items have the same frequency (LFU),
        discard the least recently used among them (LRU)
        based on the keys_freq list.
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                if len(self.cache_data) + 1 > self.MAX_ITEMS:
                    lfu_key, _ = self.keys_freq[-1]
                    self.cache_data.pop(lfu_key)
                    self.keys_freq.pop()
                    print("DISCARD:", lfu_key)
                self.cache_data[key] = item
                ins_index = len(self.keys_freq)
                for i, key_freq in enumerate(self.keys_freq):
                    if key_freq[1] == 0:
                        ins_index = i
                        break
                self.keys_freq.insert(ins_index, [key, 0])
            else:
                self.cache_data[key] = item
                self.__reorder_items(key)

    def get(self, key):
        """
        Get an item from the cache by its key.
        - If key is None or doesn't exist, return None.
        - Otherwise, return the value associated with
        the key and update its access count.
        """
        if key is not None and key in self.cache_data:
            self.__reorder_items(key)
        return self.cache_data.get(key, None)
