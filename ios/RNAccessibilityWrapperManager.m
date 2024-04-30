//
//  RNAccessibilityWrapperManager.m
//  Rubios
//
//  Created by Usman Arif on 15/11/2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTUIManager.h>
#import "RNAccessibilityWrapper.h"
#import "RNAccessibilityWrapperManager.h"

@implementation RNAccessibilityWrapperManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [[RNAccessibilityWrapper alloc] init];
}

RCT_EXPORT_METHOD(setAccessibilityFields:(nonnull NSNumber *)reactTag
                  fieldsReactTags: (nonnull NSArray *)fieldsReactTags) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RNAccessibilityWrapper *component = (RNAccessibilityWrapper *)[self.bridge.uiManager viewForReactTag:reactTag];

    NSMutableArray *fields = [NSMutableArray arrayWithCapacity:[fieldsReactTags count]];

    [fieldsReactTags enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL * stop) {
      if ([obj isKindOfClass:[NSNumber class]]) {
        NSNumber *tag = (NSNumber *)obj;
        UIView *field = [self.bridge.uiManager viewForReactTag:tag];
        [fields addObject:field];
      }
    }];

    [component setAccessibilityFields: fields];
  });
}

@end
