#!/usr/bin/env python3
""" 2-lifo_cache module """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache inherits from BaseCaching and implements a LIFO caching system.
    """

    def __init__(self):
        """
        Initialize the parent class and
        set MAX_ITEMS based on BaseCaching.MAX_ITEMS.
        """
        super().__init__()
        self.cache_data = {}

    def put(self, key, item):
        """
        Add an item to the cache, following the LIFO strategy.
        - If key or item is None, do nothing.
        - Otherwise, update the cache_data dictionary.
        - If the cache reaches its maximum size,
        discard the most recently added item (LIFO).
        """
        if key is not None and item is not None:
            self.cache_data[key] = item
            if len(self.cache_data) > self.MAX_ITEMS:
                discarded_key = self.cache_data.popitem()[0]
                print("DISCARD: {}".format(discarded_key))

    def get(self, key):
        """
        Get an item from the cache by its key.
        - If key is None or doesn't exist, return None.
        - Otherwise, return the value associated with the key.
        """
        return self.cache_data.get(key)
