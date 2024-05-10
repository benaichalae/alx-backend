#!/usr/bin/env python3
""" 0-basic_cache module """

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    BasicCache inherits from BaseCaching
    and implements a simple caching system
    without size limitations.
    """

    def __init__(self):
        """ Initialize the parent class and set MAX_ITEMS to None"""
        super().__init__()
        self.MAX_ITEMS = None

    def put(self, key, item):
        """
        Add an item to the cache.
        - If key or item is None, do nothing.
        - Otherwise, update the cache_data dictionary with the key-value pair.
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item from the cache by its key.
        - If key is None or doesn't exist, return None.
        - Otherwise, return the value associated with the key.
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
