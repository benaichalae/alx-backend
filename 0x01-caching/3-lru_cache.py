#!/usr/bin/env python3
""" 3-lru_cache module """

from collections import OrderedDict

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRUCache inherits from BaseCaching and implements an LRU caching system.
    """

    def __init__(self):
        """
        Initialize the parent class and
        set MAX_ITEMS based on BaseCaching.MAX_ITEMS.
        Use an ordered dictionary (OrderedDict)
        to track key access order for LRU.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        Add an item to the cache, following the LRU strategy.
        - If key or item is None, do nothing.
        - Otherwise, update the cache_data dictionary and access_order.
        - If the cache reaches its maximum size,
        discard the least recently used item (LRU).
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                    lru_key, _ = self.cache_data.popitem(True)
                    print("DISCARD:", lru_key)
                self.cache_data[key] = item
                self.cache_data.move_to_end(key, last=False)
            else:
                self.cache_data[key] = item

    def get(self, key):
        """
        Get an item from the cache by its key.
        - If key is None or doesn't exist, return None.
        - Otherwise, update the access order
        to mark the key as recently used (LRU).
        - Return the value associated with the key.
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)

