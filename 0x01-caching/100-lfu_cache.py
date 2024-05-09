#!/usr/bin/env python3
""" 100-lfu_cache module """

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
        self.cache_data = {}
        self.counts = {}
        self.uses_by_count = collections.defaultdict(collections.OrderedDict)

    def put(self, key, item):
        """
        Add an item to the cache,
        following the LFU strategy with LRU tiebreaker.
        - If key or item is None, do nothing.
        - Otherwise, update the cache_data, counts,
        and uses_by_count dictionaries.
        - If the cache reaches its maximum size,
        discard the least frequently used item (LFU).
        - If multiple items have the same frequency (LFU),
        discard the least recently used
          among them (LRU) based on the uses_by_count dictionary.
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.counts[key] += 1
            else:
                self.counts[key] = 1
                if len(self.cache_data) >= self.MAX_ITEMS:
                    min_count = min(self.counts.values())
                    to_discard = self.uses_by_count[min_count].popitem(
                            last=False)
                    del self.cache_data[to_discard[0]]
                    del self.counts[to_discard[0]]
                    print("DISCARD: {}".format(to_discard[0]))

            self.cache_data[key] = item
            self.uses_by_count[self.counts[key]][key] = True

    def get(self, key):
        """
        Get an item from the cache by its key.
        - If key is None or doesn't exist, return None.
        - Otherwise, return the value associated with
        the key and update its access count.
        """
        if key is not None and key in self.cache_data:
            self.counts[key] += 1
            self.uses_by_count[self.counts[key]].move_to_end(key)
            return self.cache_data[key]
        return None
