import React from 'react';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../store/modules/cart/actions';
import { formatPrice } from '../../util/format';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Products,
  Product,
  ProductInfo,
  ProductImage,
  ProductDetails,
  ProductTitle,
  ProductPrice,
  ProductDelete,
  ProductControls,
  ProductControlButton,
  ProductAmount,
  ProductSubtotal,
  TotalContainer,
  TotalText,
  TotalAmount,
  Order,
  OrderText,
  EmptyContainer,
  EmptyText,
  ProductList,
} from './styles';

export default function Cart() {
  const cartProducts = useSelector(state =>
    state.cart.map(product => ({
      ...product,
      subtotal: formatPrice(product.price * product.amount),
      priceFormatted: formatPrice(product.price),
    })),
  );

  const total = useSelector(state =>
    formatPrice(
      state.cart.reduce((totalSum, product) => {
        return totalSum + product.price * product.amount;
      }, 0),
    ),
  );

  const dispatch = useDispatch();

  function decrement(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount - 1));
  }

  function increment(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount + 1));
  }

  return (
    <Container>
      <ScrollView>
        <ProductList>
          {cartProducts.length ? (
            <>
              <Products>
                {cartProducts.map(product => (
                  <Product key={product.id}>
                    <ProductInfo>
                      <ProductImage source={{ uri: product.image }} />
                      <ProductDetails>
                        <ProductTitle>{product.title}</ProductTitle>
                        <ProductPrice>{product.priceFormatted}</ProductPrice>
                      </ProductDetails>
                      <ProductDelete
                        onPress={() =>
                          dispatch(CartActions.removeFromCart(product.id))
                        }
                      >
                        <Icon
                          name="delete-forever"
                          size={24}
                          color={colors.primary}
                        />
                      </ProductDelete>
                    </ProductInfo>
                    <ProductControls>
                      <ProductControlButton onPress={() => decrement(product)}>
                        <Icon
                          name="remove-circle-outline"
                          size={20}
                          color={colors.primary}
                        />
                      </ProductControlButton>
                      <ProductAmount value={String(product.amount)} />
                      <ProductControlButton onPress={() => increment(product)}>
                        <Icon
                          name="add-circle-outline"
                          size={20}
                          color={colors.primary}
                        />
                      </ProductControlButton>
                      <ProductSubtotal>{product.subtotal}</ProductSubtotal>
                    </ProductControls>
                  </Product>
                ))}
              </Products>
              <TotalContainer>
                <TotalText>TOTAL</TotalText>
                <TotalAmount>{total}</TotalAmount>
                <Order>
                  <OrderText>PROCEED TO CKECKOUT</OrderText>
                </Order>
              </TotalContainer>
            </>
          ) : (
            <EmptyContainer>
              <Icon name="remove-shopping-cart" size={64} color="#eee" />
              <EmptyText>Your cart is empty.</EmptyText>
            </EmptyContainer>
          )}
        </ProductList>
      </ScrollView>
    </Container>
  );
}
